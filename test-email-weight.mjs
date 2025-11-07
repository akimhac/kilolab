import { Resend } from 'resend';

const resend = new Resend('re_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG');

async function testWeightEmail() {
  try {
    console.log('📧 Test email PESÉE...');
    
    const { data, error } = await resend.emails.send({
      from: 'KiloLab <onboarding@resend.dev>',
      to: ['akim.hachili@gmail.com'],
      subject: '⚖️ Votre linge a été pesé - Paiement requis',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚖️ Pesée effectuée !</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
            <p style="font-size: 16px; color: #374151;">Bonjour Akim,</p>
            <p style="font-size: 16px; color: #374151;">
              Votre commande <strong>#ABC12345</strong> a été pesée par <strong>Pressing Test Paris</strong>.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
              <p style="margin: 5px 0; font-size: 18px;"><strong>Poids:</strong> 3.5 kg</p>
              <p style="margin: 5px 0; font-size: 24px; color: #8b5cf6;"><strong>Prix total:</strong> 35.00 €</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://kilolab.fr/checkout?order_id=test123" 
                 style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                💳 Payer maintenant
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Cliquez sur le bouton ci-dessus pour effectuer le paiement sécurisé via Stripe.
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
            Merci de votre confiance !<br>
            L'équipe KiloLab
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log('✅ Email pesée envoyé !');
    console.log('📧 ID:', data.id);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testWeightEmail();
