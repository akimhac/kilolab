import { Resend } from 'resend';

const resend = new Resend('re_123456789'); // Votre clé API

export const partnerOnboardingService = {
  // Email bienvenue pressing
  async sendWelcomeEmail(partnerEmail: string, partnerName: string) {
    try {
      await resend.emails.send({
        from: 'Kilolab <contact@kilolab.fr>',
        to: partnerEmail,
        subject: '🎉 Bienvenue chez Kilolab !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Bienvenue dans le réseau Kilolab !</h1>
            
            <p>Bonjour <strong>${partnerName}</strong>,</p>
            
            <p>Félicitations ! Votre inscription au réseau Kilolab est confirmée.</p>
            
            <h2>🚀 Prochaines étapes :</h2>
            <ol>
              <li><strong>Validation de votre profil</strong> : Notre équipe va vérifier vos informations (24-48h)</li>
              <li><strong>Formation à l'outil</strong> : Vous recevrez un tutoriel vidéo</li>
              <li><strong>Activation</strong> : Dès validation, vous apparaîtrez sur notre carte</li>
            </ol>
            
            <h2>📊 Votre dashboard partenaire :</h2>
            <p>Connectez-vous dès maintenant : <a href="https://kilolab.fr/partner-dashboard">Dashboard Kilolab</a></p>
            
            <h2>💰 Commission :</h2>
            <p>Vous recevrez <strong>90% du montant</strong> de chaque commande (Kilolab prend 10%).</p>
            
            <p>Des questions ? Répondez directement à cet email !</p>
            
            <p>À très bientôt,<br>L'équipe Kilolab</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Erreur envoi email bienvenue:', error);
    }
  },

  // Email validation complète
  async sendActivationEmail(partnerEmail: string, partnerName: string) {
    try {
      await resend.emails.send({
        from: 'Kilolab <contact@kilolab.fr>',
        to: partnerEmail,
        subject: '✅ Votre pressing est maintenant actif !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10b981;">🎉 Félicitations ${partnerName} !</h1>
            
            <p>Votre pressing est désormais <strong>visible sur la carte Kilolab</strong>.</p>
            
            <p>Les clients peuvent maintenant vous trouver et déposer leur linge chez vous.</p>
            
            <h2>📋 Checklist rapide :</h2>
            <ul>
              <li>✅ Votre profil est validé</li>
              <li>✅ Vous êtes visible sur la carte</li>
              <li>✅ Vous pouvez recevoir des commandes</li>
            </ul>
            
            <h2>🔔 Restez alerté :</h2>
            <p>Vous recevrez un email à chaque nouvelle commande.</p>
            
            <p>Accédez à votre dashboard : <a href="https://kilolab.fr/partner-dashboard">Dashboard</a></p>
            
            <p>Bonne chance !<br>L'équipe Kilolab</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Erreur envoi email activation:', error);
    }
  }
};
