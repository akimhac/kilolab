const RESEND_API_KEY = 're_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab <contact@kilolab.fr>',
        to: data.to,
        subject: data.subject,
        html: data.html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email send failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

export const emailTemplates = {
  orderConfirmation: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f8fafc; padding: 40px 30px; }
        .card { background: white; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .button { display: inline-block; padding: 14px 28px; background: #2563eb; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .total { font-size: 24px; font-weight: 700; color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Commande confirmée</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Votre commande a été enregistrée avec succès !</p>
          
          <div class="card">
            <h3>📦 Détails de la commande</h3>
            <div class="detail-row">
              <span>Pressing</span>
              <strong>${data.partnerName}</strong>
            </div>
            <div class="detail-row">
              <span>Poids</span>
              <strong>${data.weight} kg</strong>
            </div>
            <div class="detail-row">
              <span>Formule</span>
              <strong>${data.serviceType}</strong>
            </div>
            <div class="detail-row" style="border: none;">
              <span>Total</span>
              <span class="total">${data.total}€</span>
            </div>
          </div>

          <p style="background: #fef3c7; padding: 16px; border-radius: 8px;">
            <strong>⏰ Prochaine étape :</strong> Déposez votre linge au pressing avant le ${data.pickupDate}.
          </p>
          
          <div style="text-align: center;">
            <a href="https://kilolab.fr/client-dashboard" class="button">Suivre ma commande</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>Kilolab</strong> - Votre pressing au kilo</p>
          <p><a href="https://kilolab.fr">kilolab.fr</a> | contact@kilolab.fr</p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderReady: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { background: #f8fafc; padding: 40px 30px; }
        .card { background: white; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .button { display: inline-block; padding: 14px 28px; background: #10b981; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Votre linge est prêt !</h1>
        </div>
        <div class="content">
          <p>Bonne nouvelle ! Votre linge est propre et vous attend.</p>
          
          <div class="card">
            <h3>📍 Point de retrait</h3>
            <p><strong>${data.partnerName}</strong></p>
            <p>${data.partnerAddress}</p>
            <p><strong>Horaires :</strong> Lun-Ven 8h-19h, Sam 9h-18h</p>
          </div>

          <p style="background: #dbeafe; padding: 16px; border-radius: 8px;">
            <strong>🔑 N° commande :</strong> #${data.orderNumber}
          </p>
          
          <div style="text-align: center;">
            <a href="https://kilolab.fr/client-dashboard" class="button">Voir ma commande</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>Kilolab</strong></p>
          <p><a href="https://kilolab.fr">kilolab.fr</a></p>
        </div>
      </div>
    </body>
    </html>
  `
};
