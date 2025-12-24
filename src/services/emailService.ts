// Fichier: src/services/emailService.ts

// Interface pour les données
interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Fonction générique d'envoi
async function sendEmail(data: EmailData) {
  try {
    // On appelle notre propre API Vercel (/api/send-email)
    // Plus de clé API ici, c'est sécurisé !
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
    // On ne bloque pas l'appli, on retourne null
    return null;
  }
}

// --- TEMPLATES HTML ---
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
    <body style="font-family: sans-serif; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #14b8a6; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">✅ Commande Reçue !</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${data.customerName},</p>
          <p>Votre commande <strong>#${data.orderNumber}</strong> est bien enregistrée.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Poids :</strong> ${data.weight} kg</p>
            <p><strong>Formule :</strong> ${data.serviceType}</p>
            <p><strong>Total :</strong> ${data.total} €</p>
            <p><strong>Date :</strong> ${data.pickupDate}</p>
          </div>

          <p>Nous recherchons le meilleur artisan pour vous. Vous recevrez une confirmation très vite.</p>
          
          <a href="https://kilolab.fr/dashboard" style="display: block; background: #0f172a; color: white; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold;">Suivre ma commande</a>
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
    <body style="font-family: sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
          <h1>🎉 Votre linge est prêt !</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${data.customerName},</p>
          <p>Vous pouvez récupérer votre linge propre ici :</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
            <h3>📍 ${data.partnerName}</h3>
            <p>${data.partnerAddress}</p>
          </div>
          <p>N'oubliez pas votre code de commande : <strong>#${data.orderNumber}</strong></p>
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
    <body style="font-family: sans-serif;">
      <div style="padding: 20px; background: #fff7ed; border-left: 4px solid #f97316;">
        <h2 style="color: #9a3412;">🔔 Nouvelle Mission Kilolab</h2>
        <p>Bonjour ${data.partnerName}, une commande est disponible !</p>
        <ul>
          <li><strong>Poids :</strong> ${data.weight} kg</li>
          <li><strong>Gain :</strong> ${data.total} €</li>
        </ul>
        <a href="https://kilolab.fr/partner-dashboard">Accepter la mission</a>
      </div>
    </body>
    </html>
  `
};

// --- FONCTIONS EXPORTÉES ---

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
