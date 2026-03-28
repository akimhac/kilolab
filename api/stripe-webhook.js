const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

// Send order confirmation email to client
async function sendClientConfirmationEmail(order, clientEmail) {
  try {
    await resend.emails.send({
      from: 'Kilolab <noreply@kilolab.fr>',
      to: clientEmail,
      subject: `✅ Commande #${order.id.slice(0, 8).toUpperCase()} confirmée !`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #14b8a6; margin: 0;">Kilolab</h1>
            <p style="color: #64748b; margin: 5px 0;">Votre pressing à domicile</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #14b8a6, #06b6d4); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 10px 0;">Paiement reçu ! 🎉</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 0;">Votre commande est confirmée</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Récapitulatif</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">N° Commande</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e293b;">#${order.id.slice(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Formule</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e293b;">${order.formula === 'eco' ? 'Standard' : 'Express'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Poids</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e293b;">${order.weight} kg</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 0; color: #1e293b; font-weight: bold;">Total payé</td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #14b8a6; font-size: 1.25em;">${parseFloat(order.total_price).toFixed(2)} €</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px 20px; border-radius: 12px; margin-bottom: 20px;">
            <p style="margin: 0; color: #047857; font-weight: 500;">
              📦 <strong>Prochaine étape :</strong> Un Washer va prendre en charge votre linge sous peu. Vous recevrez une notification.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://kilolab.fr/dashboard" style="display: inline-block; background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Suivre ma commande
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Kilolab - Le pressing à domicile<br>
              <a href="https://kilolab.fr" style="color: #14b8a6;">kilolab.fr</a>
            </p>
          </div>
        </div>
      `
    });
    console.log('✅ Client confirmation email sent');
  } catch (error) {
    console.error('Email error:', error);
  }
}

// Send notification to admin
async function sendAdminNotification(order) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'akim.hachili@gmail.com';
    await resend.emails.send({
      from: 'Kilolab <noreply@kilolab.fr>',
      to: adminEmail,
      subject: `💰 Nouvelle commande payée #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #14b8a6;">Nouvelle commande payée ! 💰</h2>
          <p><strong>Commande:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Montant:</strong> ${parseFloat(order.total_price).toFixed(2)} €</p>
          <p><strong>Poids:</strong> ${order.weight} kg</p>
          <p><strong>Zone:</strong> ${order.city || order.postal_code || 'Non spécifiée'}</p>
          <p><strong>Statut:</strong> ${order.washer_id ? 'Assigné à un washer' : 'En attente d\'assignation'}</p>
          <br>
          <a href="https://kilolab.fr/admin" style="background: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">
            Voir dans l'admin
          </a>
        </div>
      `
    });
    console.log('✅ Admin notification sent');
  } catch (error) {
    console.error('Admin email error:', error);
  }
}

// Find best washer for order
async function findAndAssignWasher(order) {
  try {
    const { data: washers } = await supabase
      .from('washers')
      .select('id, full_name, city, postal_code, is_available')
      .eq('status', 'approved')
      .eq('is_available', true);

    if (!washers || washers.length === 0) return null;

    // Score washers by location match
    const orderPostal = order.postal_code || '';
    const orderCity = (order.city || '').toLowerCase();

    const scoredWashers = washers.map(w => {
      let score = 0;
      const wPostal = w.postal_code || '';
      const wCity = (w.city || '').toLowerCase();

      if (orderPostal && wPostal === orderPostal) score += 50;
      else if (orderPostal.substring(0, 2) === wPostal.substring(0, 2)) score += 30;
      
      if (orderCity && wCity.includes(orderCity)) score += 20;

      return { ...w, score };
    });

    scoredWashers.sort((a, b) => b.score - a.score);
    
    if (scoredWashers[0] && scoredWashers[0].score > 20) {
      return scoredWashers[0];
    }
    return null;
  } catch (error) {
    console.error('Find washer error:', error);
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).json({ error: 'Webhook Error' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      
      if (!orderId) {
        console.log('No order_id in session metadata');
        break;
      }

      console.log(`✅ Payment completed for order ${orderId}`);

      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        console.error('Order not found:', orderId);
        break;
      }

      // Update order status to paid
      await supabase
        .from('orders')
        .update({ 
          status: 'pending',
          payment_status: 'paid',
          stripe_payment_id: session.payment_intent,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      // Try to auto-assign a washer
      const bestWasher = await findAndAssignWasher(order);
      if (bestWasher) {
        await supabase
          .from('orders')
          .update({ 
            washer_id: bestWasher.id,
            status: 'assigned'
          })
          .eq('id', orderId);
        console.log(`✅ Order assigned to washer ${bestWasher.full_name}`);
      }

      // Get client email
      const { data: client } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', order.client_id)
        .single();

      // Send confirmation emails
      const clientEmail = client?.email || session.customer_email;
      if (clientEmail) {
        await sendClientConfirmationEmail(order, clientEmail);
      }
      await sendAdminNotification(order);

      // Notify nearby washers if no washer was auto-assigned
      if (!bestWasher) {
        try {
          const siteUrl = process.env.SITE_URL || 'https://kilolab.fr';
          await fetch(`${siteUrl}/api/notify-washers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, max_distance_km: 50 })
          });
          console.log('✅ Nearby washers notified');
        } catch (notifyError) {
          console.error('Failed to notify washers:', notifyError);
        }
      }

      break;
    }

    case 'account.updated': {
      const account = event.data.object;
      
      await supabase
        .from('user_profiles')
        .update({
          stripe_charges_enabled: account.charges_enabled,
          stripe_payouts_enabled: account.payouts_enabled,
          stripe_details_submitted: account.details_submitted,
          stripe_onboarding_complete: account.details_submitted && account.charges_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_account_id', account.id);
      
      console.log(`✅ Account ${account.id} updated`);
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
