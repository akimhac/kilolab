const RESEND_API_KEY = 're_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(data: EmailData) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab <contact@kilolab.fr>',
        to: data.to,
        subject: data.subject,
        html: data.html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email send failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

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
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 20px 0; }
        .detail { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .total { font-size: 28px; font-weight: 700; color: #2563eb; }
        .button { display: inline-block; padding: 16px 32px; background: #2563eb; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; background: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">✅ Commande confirmée !</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Commande #${data.orderNumber}</p>
        </div>
        
        <div class="content">
          <p style="font-size: 18px; margin-bottom: 20px;">Bonjour ${data.customerName},</p>
          <p style="font-size: 16px; color: #475569;">Votre commande a été enregistrée avec succès ! 🎉</p>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 20px;">📦 Détails de la commande</h3>
            <div class="detail">
              <span style="color: #64748b;">Pressing</span>
              <strong>${data.partnerName}</strong>
            </div>
            <div class="detail">
              <span style="color: #64748b;">Adresse</span>
              <strong>${data.partnerAddress}</strong>
            </div>
            <div class="detail">
              <span style="color: #64748b;">Poids</span>
              <strong>${data.weight} kg</strong>
            </div>
            <div class="detail">
              <span style="color: #64748b;">Formule</span>
              <strong>${data.serviceType === 'express' ? 'Express (24h)' : 'Standard (48-72h)'}</strong>
            </div>
            <div class="detail" style="border: none; margin-top: 12px; padding-top: 12px; border-top: 2px solid #e2e8f0;">
              <span style="font-size: 18px; color: #1e293b;">Total</span>
              <span class="total">${data.total.toFixed(2)}€</span>
            </div>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <strong style="color: #92400e;">⏰ Prochaine étape :</strong>
            <p style="margin: 8px 0 0 0; color: #78350f;">Déposez votre linge au pressing avant le ${data.pickupDate}.</p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://kilolab.fr/client-dashboard" class="button">Suivre ma commande</a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0;"><strong>Kilolab</strong> - Votre pressing au kilo</p>
          <p style="margin: 0;"><a href="https://kilolab.fr" style="color: #2563eb; text-decoration: none;">kilolab.fr</a> | <a href="mailto:contact@kilolab.fr" style="color: #2563eb; text-decoration: none;">contact@kilolab.fr</a></p>
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
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .card { background: #f0fdf4; border-radius: 12px; padding: 24px; margin: 20px 0; border: 2px solid #86efac; }
        .button { display: inline-block; padding: 16px 32px; background: #10b981; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; }
        .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; background: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 36px;">🎉 Votre linge est prêt !</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Commande #${data.orderNumber}</p>
        </div>
        
        <div class="content">
          <p style="font-size: 18px;">Bonjour ${data.customerName},</p>
          <p style="font-size: 16px; color: #475569;">Bonne nouvelle ! Votre linge est propre et vous attend. ✨</p>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #166534; font-size: 20px;">📍 Point de retrait</h3>
            <p style="margin: 8px 0; font-size: 18px;"><strong>${data.partnerName}</strong></p>
            <p style="margin: 4px 0; color: #64748b;">${data.partnerAddress}</p>
            <p style="margin: 16px 0 0 0;"><strong style="color: #166534;">Horaires :</strong> Lun-Ven 8h-19h, Sam 9h-18h</p>
          </div>

          <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <strong style="color: #1e40af;">🔑 N° de commande :</strong>
            <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #1e40af;">#${data.orderNumber}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://kilolab.fr/client-dashboard" class="button">Voir ma commande</a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0;"><strong>Kilolab</strong></p>
          <p style="margin: 0;"><a href="https://kilolab.fr" style="color: #2563eb; text-decoration: none;">kilolab.fr</a></p>
        </div>
      </div>
    </body>
    </html>
  `,

  partnerNewOrder: (data: {
    partnerName: string;
    orderNumber: string;
    customerEmail: string;
    weight: number;
    serviceType: string;
    total: number;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .card { background: #fef3c7; border-radius: 12px; padding: 24px; margin: 20px 0; border: 2px solid #fbbf24; }
        .button { display: inline-block; padding: 16px 32px; background: #f59e0b; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🔔 Nouvelle commande !</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Commande #${data.orderNumber}</p>
        </div>
        
        <div class="content">
          <p style="font-size: 18px;">Bonjour ${data.partnerName},</p>
          <p style="font-size: 16px;">Vous avez reçu une nouvelle commande via Kilolab.</p>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #92400e;">📦 Détails</h3>
            <p><strong>Client :</strong> ${data.customerEmail}</p>
            <p><strong>Poids estimé :</strong> ${data.weight} kg</p>
            <p><strong>Formule :</strong> ${data.serviceType === 'express' ? 'Express (24h)' : 'Standard (48-72h)'}</p>
            <p><strong>Montant :</strong> ${data.total.toFixed(2)}€</p>
          </div>

          <div style="text-align: center;">
            <a href="https://kilolab.fr/partner-dashboard" class="button">Voir le dashboard</a>
          </div>
        </div>
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
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .card { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h2>📧 Nouveau message depuis le formulaire de contact</h2>
          <p><strong>De :</strong> ${data.name} (${data.email})</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <hr>
          <p><strong>Message :</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    </body>
    </html>
  `
};

export async function sendOrderConfirmation(data: any) {
  return sendEmail({
    to: data.customerEmail,
    subject: `✅ Commande confirmée #${data.orderNumber}`,
    html: emailTemplates.orderConfirmation(data)
  });
}

export async function sendOrderReady(data: any) {
  return sendEmail({
    to: data.customerEmail,
    subject: `🎉 Votre linge est prêt ! #${data.orderNumber}`,
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
    to: 'contact@kilolab.fr',
    subject: `📧 Contact : ${data.subject}`,
    html: emailTemplates.contactForm(data)
  });
}
