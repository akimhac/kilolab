import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const partnerOnboardingService = {
  async sendPartnerWelcomeWithPromo(
    partnerEmail: string, 
    partnerName: string, 
    promoEndDate: string
  ) {
    try {
      await resend.emails.send({
        from: 'Kilolab <contact@kilolab.fr>',
        to: partnerEmail,
        subject: '🎉 Bienvenue chez Kilolab - Votre 1er mois est OFFERT !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; border-radius: 20px;">
              <div style="background: white; border-radius: 15px; padding: 30px;">
                <h1 style="color: #10b981; font-size: 28px; margin-bottom: 15px; text-align: center;">
                  🎉 Bienvenue chez Kilolab !
                </h1>
                
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
                  <p style="font-size: 22px; font-weight: bold; margin: 0 0 8px 0;">
                    🎁 VOTRE 1ER MOIS EST OFFERT !
                  </p>
                  <p style="font-size: 16px; margin: 0;">
                    0€ de commission jusqu'au ${new Date(promoEndDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Bonjour <strong>${partnerName}</strong>,
                </p>
                
                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Vous faites partie des 100 premiers pressings ! 
                  Vous bénéficiez de <strong style="color: #10b981;">30 jours gratuits</strong>.
                </p>

                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                  <h3 style="color: #059669; margin-top: 0; font-size: 16px;">🚀 Vos avantages :</h3>
                  <ul style="color: #333; line-height: 1.6; font-size: 14px;">
                    <li>✅ 0€ de commission pendant 30 jours</li>
                    <li>✅ Visibilité immédiate sur la carte</li>
                    <li>✅ Paiements automatiques</li>
                    <li>✅ Support 7j/7</li>
                  </ul>
                </div>

                <h3 style="color: #333; margin-top: 25px; font-size: 16px;">📊 Après les 30 jours :</h3>
                <p style="color: #666; font-size: 14px;">
                  Seulement <strong style="color: #10b981;">10% de commission</strong> par commande.
                </p>

                <div style="text-align: center; margin-top: 25px;">
                  <a href="https://kilolab.fr/partner-dashboard" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                    Accéder à mon dashboard
                  </a>
                </div>

                <p style="color: #666; font-size: 13px; margin-top: 25px; text-align: center;">
                  Des questions ? Répondez à cet email !
                </p>

                <p style="color: #666; font-size: 13px; text-align: center; margin-top: 15px;">
                  À très bientôt,<br>
                  <strong>L'équipe Kilolab</strong>
                </p>
              </div>
            </div>
          </div>
        `
      });
      
      console.log('✅ Email promo envoyé à', partnerEmail);
    } catch (error) {
      console.error('❌ Erreur envoi email promo:', error);
    }
  }
};
