// Vercel Serverless Function: Auto-refund via Stripe
const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe secret key not configured' });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const { payment_intent_id, amount, reason } = req.body || {};

  if (!payment_intent_id) {
    return res.status(400).json({ error: 'Missing payment_intent_id' });
  }

  try {
    // Build refund params
    const refundParams = {
      payment_intent: payment_intent_id,
      reason: reason || 'requested_by_customer',
    };

    // If amount specified, do partial refund (in cents)
    if (amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundParams);

    console.log(`Refund created: ${refund.id} for PI: ${payment_intent_id}`);

    return res.status(200).json({
      success: true,
      refund_id: refund.id,
      amount: refund.amount / 100,
      currency: refund.currency,
      status: refund.status,
    });
  } catch (error) {
    console.error('Stripe refund error:', error.message);
    
    // Handle specific Stripe errors
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
