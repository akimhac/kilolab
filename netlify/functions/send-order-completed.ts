import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, orderId, partnerName } = JSON.parse(event.body || '{}');

    await resend.emails.send({
      from: 'Kilolab <noreply@kilolab.fr>',
      to: email,
      subject: '🎉 Merci pour votre confiance ! - Kilolab',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 10px; margin-top: 20px; }
            .rating-box { background: #fef3c7; border: 2px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .star { font-size: 32px; margin: 0 5px; cursor: pointer; }
            .cta-button { display: inline-block; background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
            .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
              <h1>Merci pour votre confiance !</h1>
              <p>Votre commande est terminée</p>
            </div>

            <div class="content">
              <p>Bonjour,</p>
              <p>Merci d'avoir utilisé Kilolab ! Nous espérons que vous êtes satisfait du service.</p>

              <div class="rating-box">
                <h3 style="margin-top: 0; color: #92400e;">⭐ Donnez votre avis</h3>
                <p style="margin-bottom: 15px;">Qu'avez-vous pensé de <strong>${partnerName}</strong> ?</p>
                <a href="https://kilolab.fr/order/${orderId}/review" class="cta-button">
                  Laisser un avis
                </a>
                <p style="margin-top: 15px; font-size: 14px; color: #78716c;">
                  Votre avis aide d'autres clients et les pressings à s'améliorer
                </p>
              </div>

              <h3>💰 Code promo pour vous :</h3>
              <div style="background: #dbeafe; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1e40af;">KILOLAB10</p>
                <p style="margin: 5px 0 0 0; color: #1e3a8a;">-10% sur votre prochaine commande</p>
              </div>

              <p style="margin-top: 30px;">
                <strong>N° de commande :</strong> #${orderId.substring(0, 8).toUpperCase()}
              </p>

              <center>
                <a href="https://kilolab.fr/partners-map" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                  Faire une nouvelle commande
                </a>
              </center>
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
