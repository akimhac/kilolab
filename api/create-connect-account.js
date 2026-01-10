const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, businessName, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email et userId requis' });
    }

    // Vérifier si compte existe déjà
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_account_id')
      .eq('id', userId)
      .single();

    if (profile?.stripe_account_id) {
      const accountLink = await stripe.accountLinks.create({
        account: profile.stripe_account_id,
        refresh_url: `https://kilolab.fr/connect-stripe?refresh=true`,
        return_url: `https://kilolab.fr/partner-dashboard?stripe_connected=true`,
        type: 'account_onboarding',
      });

      return res.status(200).json({
        accountId: profile.stripe_account_id,
        url: accountLink.url,
      });
    }

    // Créer nouveau compte
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: email,
      business_type: 'company',
      business_profile: { 
        name: businessName || 'Pressing Partenaire',
        mcc: '7210',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Sauvegarder dans Supabase
    await supabase
      .from('user_profiles')
      .update({ 
        stripe_account_id: account.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `https://kilolab.fr/connect-stripe?refresh=true`,
      return_url: `https://kilolab.fr/partner-dashboard?stripe_connected=true`,
      type: 'account_onboarding',
    });

    return res.status(200).json({
      accountId: account.id,
      url: accountLink.url,
    });

  } catch (error) {
    console.error('Stripe Connect Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
