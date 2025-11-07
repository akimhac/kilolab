import { Resend } from 'resend';

const resend = new Resend('re_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG');

async function testReadyEmail() {
  try {
    console.log('📧 Test email PRÊT...');
    
    const { data, error } = await resend.emails.send({
      from: 'KiloLab <onboarding@resend.dev>',
      to: ['akim.hachili@gmail.com'],
      subject: '🎉 Votre linge est prêt à récupérer !',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Votre linge est prêt !</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
            <p style="font-size: 16px; color: #374151;">Bonjour Akim,</p>
            <p style="font-size: 16px; color: #374151;">
              Bonne nouvelle ! Votre commande <strong>#ABC12345</strong> est prête.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 5px 0; font-size: 18px;"><strong>📍 À récupérer chez:</strong></p>
              <p style="margin: 5px 0; font-size: 16px; color: #374151;">Pressing Test Paris</p>
              <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">123 Rue de la Paix, 75001 Paris</p>
            </div>

            <div style="background: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
              <p style="margin: 0; font-size: 16px; font-weight: bold;">
                🕐 Horaires: Lundi-Samedi 8h-20h
              </p>
            </div>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
            À très bientôt !<br>
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

    console.log('✅ Email prêt envoyé !');
    console.log('📧 ID:', data.id);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testReadyEmail();
