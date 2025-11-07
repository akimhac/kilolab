import { Resend } from 'resend';

const resend = new Resend('re_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG');

async function testEmail() {
  try {
    console.log('📧 Envoi email de test...');
    
    const { data, error } = await resend.emails.send({
      from: 'KiloLab <onboarding@resend.dev>',
      to: ['akim.hachili@gmail.com'],
      subject: '🧪 Test KiloLab - Resend fonctionne !',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Resend fonctionne !</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
            <p style="font-size: 18px; color: #374151;">
              Félicitations Akim ! 🎉
            </p>
            <p style="font-size: 16px; color: #374151;">
              Ton système d'emails pour <strong>KiloLab</strong> est parfaitement configuré.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
              <p style="margin: 5px 0;"><strong>✅ Configuration Resend</strong> : OK</p>
              <p style="margin: 5px 0;"><strong>✅ Fonction Netlify</strong> : Prête</p>
              <p style="margin: 5px 0;"><strong>✅ Notifications automatiques</strong> : Activées</p>
            </div>

            <div style="background: #8b5cf6; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-weight: bold;">🚀 Prochaine étape : Déploiement OVH</p>
            </div>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
            KiloLab - Pressing nouvelle génération<br>
            <a href="https://kilolab.fr" style="color: #8b5cf6;">kilolab.fr</a>
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log('✅ Email envoyé avec succès !');
    console.log('📧 ID:', data.id);
    console.log('');
    console.log('🎉 Va vérifier ta boîte mail: akim.hachili@gmail.com');
    console.log('💡 Vérifie aussi les spams si tu ne le vois pas !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testEmail();
