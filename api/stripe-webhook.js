const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    case 'account.updated':
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

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
