const { Resend } = require('resend');

const resend = new Resend('re_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG');

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'KiloLab <onboarding@resend.dev>',
      to: ['akim@kilolab.fr'], // Remplace par ton email
      subject: '🧪 Test KiloLab',
      html: '<h1>✅ Email fonctionne !</h1><p>Resend est bien configuré.</p>',
    });

    if (error) {
      console.error('❌ Erreur:', error);
    } else {
      console.log('✅ Email envoyé avec succès !', data);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testEmail();
