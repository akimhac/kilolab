import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');

    if (!email || !email.includes('@')) {
      return { statusCode: 400, body: 'Email invalide' };
    }

    // Vérifier si déjà inscrit
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return { statusCode: 200, body: JSON.stringify({ message: 'Déjà inscrit' }) };
    }

    // Inscrire
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, subscribed_at: new Date().toISOString() });

    if (error) throw error;

    // Envoyer email de bienvenue
    await resend.emails.send({
      from: 'Kilolab <noreply@kilolab.fr>',
      to: email,
      subject: '👋 Bienvenue dans la communauté Kilolab !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1>Bienvenue chez Kilolab ! 🎉</h1>
          </div>
          <div style="padding: 30px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; margin-top: 20px;">
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit à notre newsletter !</p>
            <p>Vous recevrez désormais :</p>
            <ul>
              <li>🎁 Nos offres exclusives</li>
              <li>💡 Conseils d'entretien textile</li>
              <li>⭐ Nouveautés et partenariats</li>
            </ul>
            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe Kilolab</strong></p>
          </div>
          <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 30px;">
            <p><a href="https://kilolab.fr/unsubscribe?email=${email}" style="color: #64748b;">Se désinscrire</a></p>
          </div>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error: any) {
    console.error('Erreur newsletter:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
