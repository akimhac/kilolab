import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, orderId, partnerName, weightKg, totalAmount, serviceType } = JSON.parse(event.body || '{}');

    await resend.emails.send({
      from: 'Kilolab <noreply@kilolab.fr>',
      to: email,
      subject: '✅ Commande confirmée - Kilolab',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 10px; margin-top: 20px; }
            .order-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { color: #64748b; }
            .value { font-weight: bold; color: #0f172a; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Commande confirmée !</h1>
              <p>Votre commande a bien été enregistrée</p>
            </div>

            <div class="content">
              <p>Bonjour,</p>
              <p>Nous avons bien reçu votre commande. Voici un récapitulatif :</p>

              <div class="order-details">
                <div class="detail-row">
                  <span class="label">N° de commande</span>
                  <span class="value">#${orderId.substring(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Pressing</span>
                  <span class="value">${partnerName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Poids estimé</span>
                  <span class="value">${weightKg} kg</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service</span>
                  <span class="value">${serviceType === 'express' ? 'Express (24h)' : 'Standard (48-72h)'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Montant</span>
                  <span class="value" style="color: #2563eb; font-size: 18px;">${totalAmount.toFixed(2)}€</span>
                </div>
              </div>

              <h3>📍 Prochaines étapes :</h3>
              <ol>
                <li>Déposez votre linge au pressing aux horaires d'ouverture</li>
                <li>Le pressing pèsera votre linge et validera la commande</li>
                <li>Vous recevrez un email quand votre linge sera prêt</li>
                <li>Récupérez votre linge propre et plié !</li>
              </ol>

              <center>
                <a href="https://kilolab.fr/order/${orderId}" class="cta-button">
                  Suivre ma commande
                </a>
              </center>

              <p style="margin-top: 30px;">
                Des questions ? Répondez à cet email ou contactez-nous à contact@kilolab.fr
              </p>
            </div>

            <div class="footer">
              <p>© 2024 Kilolab - Le pressing nouvelle génération</p>
              <p>
                <a href="https://kilolab.fr" style="color: #2563eb;">kilolab.fr</a>
              </p>
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
