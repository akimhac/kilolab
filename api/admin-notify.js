// Vercel Serverless Function - Admin Notifications
// POST /api/admin-notify

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kilolab.fr';

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing required fields: type, data' });
  }

  let subject = '';
  let html = '';

  switch (type) {
    case 'new_client':
      subject = `🆕 Nouveau client inscrit - ${data.email}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🆕 Nouveau Client Inscrit</h1>
          </div>
          <div style="background: #1e293b; padding: 25px; border-radius: 0 0 16px 16px; color: #e2e8f0;">
            <p style="margin: 0 0 15px 0;"><strong>Email :</strong> ${data.email}</p>
            <p style="margin: 0 0 15px 0;"><strong>Nom :</strong> ${data.full_name || 'Non renseigné'}</p>
            <p style="margin: 0 0 15px 0;"><strong>Ville :</strong> ${data.city || 'Non renseignée'}</p>
            <p style="margin: 0 0 15px 0;"><strong>Code postal :</strong> ${data.postal_code || 'Non renseigné'}</p>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">Inscrit le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </body>
        </html>
      `;
      break;

    case 'new_order':
      subject = `📦 Nouvelle commande #${data.id?.slice(0, 8).toUpperCase() || 'N/A'} - ${data.total_price || 0}€`;
      html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">📦 Nouvelle Commande</h1>
          </div>
          <div style="background: #1e293b; padding: 25px; border-radius: 0 0 16px 16px; color: #e2e8f0;">
            <div style="background: #0f172a; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #14b8a6;">Commande #${data.id?.slice(0, 8).toUpperCase() || 'N/A'}</p>
              <p style="margin: 0; font-size: 28px; font-weight: bold; color: #10b981;">${data.total_price || 0}€</p>
            </div>
            <p style="margin: 0 0 10px 0;"><strong>Client :</strong> ${data.client_email || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Adresse collecte :</strong> ${data.pickup_address || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Ville :</strong> ${data.city || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Poids estimé :</strong> ${data.estimated_weight || 0} kg</p>
            <p style="margin: 0 0 10px 0;"><strong>Service :</strong> ${data.service_type === 'express' ? '⚡ Express' : 'Standard'}</p>
            <hr style="border: none; border-top: 1px solid #334155; margin: 15px 0;">
            <p style="margin: 0; color: #f59e0b; font-weight: bold;">⚠️ Vérifiez la disponibilité des washers dans le ${data.postal_code?.slice(0, 2) || '??'}</p>
          </div>
        </body>
        </html>
      `;
      break;

    case 'new_washer':
      subject = `🧺 Nouvelle inscription Washer - ${data.city || 'France'}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🧺 Nouveau Washer Inscrit</h1>
          </div>
          <div style="background: #1e293b; padding: 25px; border-radius: 0 0 16px 16px; color: #e2e8f0;">
            <p style="margin: 0 0 10px 0;"><strong>Nom :</strong> ${data.full_name || 'Non renseigné'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email :</strong> ${data.email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Ville :</strong> ${data.city} (${data.postal_code})</p>
            <p style="margin: 0 0 10px 0;"><strong>Adresse :</strong> ${data.address || 'Non renseignée'}</p>
            <hr style="border: none; border-top: 1px solid #334155; margin: 15px 0;">
            <p style="margin: 0; color: #f59e0b;">⏳ En attente de validation</p>
            <a href="https://kilolab.fr/admin" style="display: block; background: #8b5cf6; color: white; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 15px;">Valider sur le Dashboard</a>
          </div>
        </body>
        </html>
      `;
      break;

    default:
      return res.status(400).json({ error: 'Unknown notification type' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab Alerts <alerts@kilolab.fr>',
        to: [ADMIN_EMAIL],
        subject,
        html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return res.status(response.status).json({ error: result.message || 'Email send failed' });
    }

    console.log(`Admin notification sent - Type: ${type}`);
    return res.status(200).json({ success: true, id: result.id });

  } catch (error) {
    console.error('Admin notify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
