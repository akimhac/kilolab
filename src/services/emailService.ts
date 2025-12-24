// Fichier: src/services/emailService.ts

// Interface pour typer les données
interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Fonction principale d'envoi
async function sendEmail(data: EmailData) {
  try {
    // On appelle notre fonction Vercel qu'on vient de créer dans /api/
    // On n'a plus besoin de mettre la clé API ici (C'est sécurisé !)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur envoi email');
    }

    return await response.json();
  } catch (error) {
    console.error('Email error:', error);
    // On retourne null pour ne pas faire planter l'application si l'email échoue
    return null;
  }
}

// --- TEMPLATES HTML (Tes jolis designs) ---
export const emailTemplates = {
  orderConfirmation: (data: {
    customerName: string;
    orderNumber: string;
    partnerName: string;
    partnerAddress: string;
    weight: number;
    serviceType: string;
    total: number;
    pickupDate: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; color: #1e293b; background-color: #f8fafc; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Commande Reçue !</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Commande #${data.orderNumber}</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Bonjour <strong>${data.customerName}</strong>,</p>
          <p>Excellente nouvelle ! Votre commande est bien enregistrée.</p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155; font-size: 16px; text-transform: uppercase;">Récapitulatif</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                <span>Poids estimé</span> <strong>${data.weight} kg</strong>
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                <span>Formule</span> <strong>${data.serviceType}</strong>
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                <span>Total estimé</span> <strong style="color: #2563eb;">${data.total.toFixed(2)} €</strong>
              </li>
              <li style="padding: 8px 0; display: flex; justify-content: space-between;">
                <span>Date prévue</span> <strong>${data.pickupDate}</strong>
              </li>
            </ul>
          </div>

          <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin-bottom: 25px;">
            <strong style="color: #9a3412;">Prochaine étape :</strong>
            <p style="margin: 5px 0 0; color: #c2410c; font-size: 14px;">
              Nous recherchons le meilleur artisan disponible dans votre zone. Vous recevrez une confirmation avec l'adresse exacte très vite.
            </p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://kilolab.fr/dashboard" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Suivre ma commande</a>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">Kilolab - Pressing au kilo nouvelle génération</p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderReady: (data: {
    customerName: string;
    orderNumber: string;
    partnerName: string;
    partnerAddress: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; color: #1e293b; background-color: #f8fafc; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎉 Votre linge est prêt !</h1>
        </div>
        <div style="padding: 30px;">
          <p>Bonjour ${data.customerName},</p>
          <p>C'est tout propre ! Vous pouvez passer récupérer votre commande <strong>#${data.orderNumber}</strong>.</p>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #a7f3d0; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #047857;">📍 Lieu de retrait</h3>
            <p style="margin: 5px 0; font-weight: bold; font-size: 18px;">${data.partnerName}</p>
            <p style="margin: 0; color: #065f46;">${data.partnerAddress}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://kilolab.fr/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Voir les détails</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  partnerNewOrder: (data: {
    partnerName: string;
    orderNumber: string;
    weight: number;
    total: number;
  }) => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; color: #1e293b;">
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #ea580c;">🔔 Nouvelle Mission Kilolab</h2>
        <p>Bonjour ${data.partnerName}, une opportunité est disponible !</p>
        <ul>
          <li><strong>Commande :</strong> #${data.orderNumber}</li>
          <li><strong>Poids estimé :</strong> ${data.weight} kg</li>
          <li><strong>Revenu estimé :</strong> ${data.total} €</li>
        </ul>
        <p>Connectez-vous pour accepter la commande.</p>
        <a href="https://kilolab.fr/partner-dashboard" style="background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder à l'Espace Pro</a>
      </div>
    </body>
    </html>
  `,

  contactForm: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif;">
      <div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h2>Nouveau message Contact</h2>
        <p><strong>De :</strong> ${data.name} (<a href="mailto:${data.email}">${data.email}</a>)</p>
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <hr/>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      </div>
    </body>
    </html>
  `
};

// --- FONCTIONS EXPORTÉES (Utilisées par tes pages) ---

export async function sendOrderConfirmation(data: any) {
  return sendEmail({
    to: data.customerEmail,
    subject: `✅ Commande reçue #${data.orderNumber}`,
    html: emailTemplates.orderConfirmation(data)
  });
}

export async function sendOrderReady(data: any) {
  return sendEmail({
    to: data.customerEmail,
    subject: `🎉 Linge prêt #${data.orderNumber}`,
    html: emailTemplates.orderReady(data)
  });
}

export async function sendPartnerNotification(data: any) {
  return sendEmail({
    to: data.partnerEmail,
    subject: `🔔 Nouvelle commande #${data.orderNumber}`,
    html: emailTemplates.partnerNewOrder(data)
  });
}

export async function sendContactEmail(data: any) {
  return sendEmail({
    to: 'contact@kilolab.fr', // L'email qui reçoit les demandes de contact
    subject: `📧 Contact : ${data.subject}`,
    html: emailTemplates.contactForm(data)
  });
}
