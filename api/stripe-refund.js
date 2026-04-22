// Vercel Serverless Function: Auto-refund via Stripe
// SECURED: Rate limiting + amount validation + audit logging
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Rate limiting: max 5 refunds per minute per IP
const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.start > 60000) {
    rateLimitMap.set(key, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= 5;
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Trop de requetes. Attendez une minute.' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe secret key not configured' });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const { payment_intent_id, amount, reason, order_id, admin_id } = req.body || {};

  if (!payment_intent_id) {
    return res.status(400).json({ error: 'Missing payment_intent_id' });
  }

  try {
    // Server-side validation: verify the payment intent exists and amount matches
    const pi = await stripe.paymentIntents.retrieve(payment_intent_id);
    if (!pi) {
      return res.status(400).json({ error: 'Payment intent not found' });
    }

    // Validate refund amount doesn't exceed original payment
    if (amount && Math.round(amount * 100) > pi.amount) {
      return res.status(400).json({ error: 'Refund amount exceeds original payment' });
    }

    // Build refund params
    const refundParams = {
      payment_intent: payment_intent_id,
      reason: reason || 'requested_by_customer',
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundParams);
    console.log(`Refund created: ${refund.id} for PI: ${payment_intent_id}`);

    // Audit log in Supabase
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('audit_logs').insert({
          user_id: admin_id || null,
          action: 'stripe_refund',
          target_table: 'orders',
          target_id: order_id || null,
          details: {
            payment_intent_id,
            refund_id: refund.id,
            amount: refund.amount / 100,
            reason,
            ip: clientIp
          }
        });
      }
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    return res.status(200).json({
      success: true,
      refund_id: refund.id,
      amount: refund.amount / 100,
      currency: refund.currency,
      status: refund.status,
    });
  } catch (error) {
    console.error('Stripe refund error:', error.message);
    
    if (error.type === 'StripeInvalidRequestError') {
      if (error.message.includes('already been refunded')) {
        return res.status(200).json({ success: true, already_refunded: true, message: 'Already refunded' });
      }
      if (error.message.includes('No such payment_intent')) {
        return res.status(400).json({ error: 'Payment intent not found', details: error.message });
      }
    }

    return res.status(500).json({ error: error.message || 'Refund failed' });
  }
};
