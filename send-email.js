// Fichier: api/send-email.js
import { Resend } from 'resend';

// On récupère la clé depuis les réglages Vercel (sécurisé)
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Gérer la sécurité (CORS) pour accepter les requêtes de ton site
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Répondre OK aux requêtes de pré-vérification du navigateur
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Récupérer les données envoyées par le frontend
  const { to, subject, html } = req.body;

  try {
    // 3. Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'Kilolab <onboarding@resend.dev>', // Garde ça tant que tu n'as pas configuré ton domaine pro sur Resend
      to: [to],
      subject: subject,
      html: html,
    });

    // 4. Succès
    res.status(200).json(data);
  } catch (error) {
    // 5. Erreur
    console.error('Erreur Resend:', error);
    res.status(500).json({ error: error.message });
  }
}
