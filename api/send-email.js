// Vercel Serverless Function - Send Email via Resend
// POST /api/send-email

// Admin email - stored securely, never exposed to frontend
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'akim.hachili@gmail.com';

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

  const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const { to, subject, html, type, data } = req.body;

  // Handle admin alert types
  if (type === 'admin_new_order' || type === 'admin_new_user') {
    return handleAdminAlert(res, RESEND_API_KEY, type, data);
  }

  // Handle washer notification when assigned by admin
  if (type === 'washer_assigned') {
    return handleWasherAssigned(res, RESEND_API_KEY, data);
  }

  if (!to || !subject) {
    return res.status(400).json({ error: 'Missing required fields: to, subject' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab <noreply@kilolab.fr>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html: html || `<p>${subject}</p>`
      })
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', resData);
      return res.status(response.status).json({ error: resData.message || 'Email send failed' });
    }

    console.log(`Email sent successfully to ${to} - Type: ${type || 'general'}`);
    return res.status(200).json({ success: true, id: resData.id });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Handle admin alerts for new orders and new users
async function handleAdminAlert(res, apiKey, type, data) {
  let subject, html;

  if (type === 'admin_new_order') {
    const order = data || {};
    subject = `🛒 Nouvelle commande #${(order.id || '').slice(0, 8).toUpperCase()}`;
    html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🛒 Nouvelle Commande !</h1>
        </div>
        <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #0f766e;"><strong>ID Commande:</strong> #${(order.id || 'N/A').slice(0, 8).toUpperCase()}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">${order.client_email || order.pickup_address || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Adresse:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${order.pickup_address || 'Non spécifiée'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Ville:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${order.pickup_city || 'Non spécifiée'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Poids estimé:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${order.weight || '?'} kg</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Montant:</td>
              <td style="padding: 10px 0; color: #10b981; font-weight: bold; font-size: 18px;">${order.total_price || '?'} €</td>
            </tr>
          </table>
          
          <a href="https://kilolab.fr/admin" style="display: block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px;">
            Voir dans le Dashboard
          </a>
        </div>
      </body>
      </html>
    `;
  } else if (type === 'admin_new_user') {
    const user = data || {};
    subject = `👤 Nouvelle inscription: ${user.email || 'Utilisateur'}`;
    html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">👤 Nouvelle Inscription !</h1>
        </div>
        <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #6d28d9;"><strong>Un nouvel utilisateur vient de s'inscrire sur Kilolab</strong></p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">${user.email || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Nom:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${user.full_name || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Rôle:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${user.role || 'client'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Date:</td>
              <td style="padding: 10px 0; color: #1e293b;">${new Date().toLocaleString('fr-FR')}</td>
            </tr>
          </table>
          
          <a href="https://kilolab.fr/admin" style="display: block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px;">
            Voir dans le Dashboard
          </a>
        </div>
      </body>
      </html>
    `;
  } else {
    return res.status(400).json({ error: 'Unknown admin alert type' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab Alertes <noreply@kilolab.fr>',
        to: [ADMIN_EMAIL],
        subject,
        html
      })
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error('Admin alert email error:', resData);
      return res.status(response.status).json({ error: resData.message || 'Email send failed' });
    }

    console.log(`Admin alert sent: ${type}`);
    return res.status(200).json({ success: true, id: resData.id, type });

  } catch (error) {
    console.error('Admin alert error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


// Handle washer notification when admin assigns them to an order
async function handleWasherAssigned(res, apiKey, data) {
  const order = data || {};
  const washerEmail = order.washer_email;
  const washerName = order.washer_name || 'Washer';

  if (!washerEmail) {
    return res.status(400).json({ error: 'Missing washer_email' });
  }

  const subject = `Nouvelle mission assignee - Commande #${(order.order_id || '').slice(0, 8).toUpperCase()}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Nouvelle Mission !</h1>
      </div>
      <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Bonjour <strong>${washerName}</strong>,</p>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">L'equipe Kilolab vous a assigne une nouvelle mission. Voici les details :</p>
        
        <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #0f766e;"><strong>Commande:</strong> #${(order.order_id || 'N/A').slice(0, 8).toUpperCase()}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Adresse de collecte:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">${order.pickup_address || 'Non specifiee'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Poids estime:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${order.weight || '?'} kg</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b;">Gain estime:</td>
            <td style="padding: 10px 0; color: #10b981; font-weight: bold; font-size: 18px;">${order.estimated_earnings || '?'} EUR</td>
          </tr>
        </table>
        
        <a href="https://kilolab.fr/washer-dashboard" style="display: block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px;">
          Voir dans mon Dashboard
        </a>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">Vous recevez cet email car vous etes washer chez Kilolab.</p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab <noreply@kilolab.fr>',
        to: [washerEmail],
        subject,
        html
      })
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error('Washer notification error:', resData);
      return res.status(response.status).json({ error: resData.message || 'Email send failed' });
    }

    console.log(`Washer assignment notification sent to ${washerEmail}`);
    return res.status(200).json({ success: true, id: resData.id, type: 'washer_assigned' });

  } catch (error) {
    console.error('Washer notification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}