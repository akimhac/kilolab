import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, orderId, partnerName, partnerAddress } = JSON.parse(event.body || '{}');

    await resend.emails.send({
      from: 'Kilolab <noreply@kilolab.fr>',
      to: email,
      subject: '✨ Votre linge est prêt ! - Kilolab',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 10px; margin-top: 20px; }
            .highlight-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
              <h1>Votre linge est prêt !</h1>
              <p>Il vous attend au pressing</p>
            </div>

            <div class="content">
              <p>Bonjour,</p>
              <p>Bonne nouvelle ! Votre linge est propre, repassé et prêt à être récupéré.</p>

              <div class="highlight-box">
                <h3 style="margin-top: 0; color: #10b981;">📍 Où récupérer ?</h3>
                <p style="margin: 0;"><strong>${partnerName}</strong></p>
                <p style="margin: 5px 0 0 0; color: #64748b;">${partnerAddress}</p>
              </div>

              <h3>⏰ Horaires d'ouverture :</h3>
              <p>Lundi - Vendredi : 9h - 19h<br>Samedi : 9h - 18h</p>

              <p style="margin-top: 30px;">
                <strong>N° de commande :</strong> #${orderId.substring(0, 8).toUpperCase()}
              </p>

              <center>
                <a href="https://kilolab.fr/order/${orderId}" class="cta-button">
                  Voir ma commande
                </a>
              </center>

              <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
                💡 <strong>Astuce :</strong> N'oubliez pas de donner votre avis après récupération. Cela aide d'autres clients !
              </p>
            </div>

            <div class="footer">
              <p>© 2024 Kilolab - Le pressing nouvelle génération</p>
              <p><a href="https://kilolab.fr" style="color: #2563eb;">kilolab.fr</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error: any) {
    console.error('Erreur envoi email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
