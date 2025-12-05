// src/services/notificationService.ts
// Service de notifications - Email, Push, In-App

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';

// ============================================
// TYPES
// ============================================

interface OrderData {
  id: string;
  weight_kg: number;
  service_type: string;
  price_per_kg: number;
  total_amount: number;
  status: string;
}

interface PartnerData {
  id: string;
  name: string;
  address: string;
  city: string;
  email: string;
  phone?: string;
}

interface UserData {
  id: string;
  email: string;
  name?: string;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

const emailTemplates = {
  orderConfirmation: (order: OrderData, partner: PartnerData) => ({
    subject: `✅ Commande confirmée - Kilolab #${order.id.substring(0, 8).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✅ Commande confirmée !</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Votre commande a bien été enregistrée. Vous pouvez maintenant déposer votre linge au pressing.
          </p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">📦 Récapitulatif</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>N° commande :</strong> #${order.id.substring(0, 8).toUpperCase()}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Service :</strong> ${order.service_type === 'express' ? '⚡ Express' : 'Standard'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Poids estimé :</strong> ${order.weight_kg} kg</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Total estimé :</strong> ${order.total_amount.toFixed(2)}€</p>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #065f46; margin: 0 0 15px 0;">📍 Pressing</h3>
            <p style="margin: 5px 0; color: #047857;"><strong>${partner.name}</strong></p>
            <p style="margin: 5px 0; color: #047857;">${partner.address}</p>
            <p style="margin: 5px 0; color: #047857;">${partner.city}</p>
            ${partner.phone ? `<p style="margin: 5px 0; color: #047857;">📞 ${partner.phone}</p>` : ''}
          </div>
          
          <a href="https://kilolab.fr/tracking/${order.id}" style="display: block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">
            Suivre ma commande
          </a>
        </div>
        
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          © 2025 Kilolab - Le pressing au kilo
        </p>
      </body>
      </html>
    `
  }),

  orderReady: (order: OrderData, partner: PartnerData) => ({
    subject: `🎉 Votre linge est prêt ! - Kilolab #${order.id.substring(0, 8).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Votre linge est prêt !</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Bonne nouvelle ! Votre linge est prêt à être récupéré.
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <p style="color: #166534; margin: 0 0 10px 0; font-size: 14px;">Votre code de retrait</p>
            <p style="font-size: 32px; font-weight: bold; color: #15803d; margin: 0; font-family: monospace; letter-spacing: 4px;">
              ${order.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">📍 Où récupérer ?</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>${partner.name}</strong></p>
            <p style="margin: 5px 0; color: #475569;">${partner.address}</p>
            <p style="margin: 5px 0; color: #475569;">${partner.city}</p>
          </div>
          
          <a href="https://kilolab.fr/pickup/${order.id}" style="display: block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">
            Afficher mon QR Code
          </a>
          
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
            💡 Présentez ce code ou le QR code au pressing pour récupérer votre linge.
          </p>
        </div>
        
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          © 2025 Kilolab - Le pressing au kilo
        </p>
      </body>
      </html>
    `
  }),

  partnerValidated: (partner: PartnerData) => ({
    subject: `🎉 Bienvenue sur Kilolab ! Votre compte est validé`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Bienvenue sur Kilolab !</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Félicitations <strong>${partner.name}</strong> ! Votre compte partenaire a été validé.
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Vous pouvez maintenant recevoir des commandes de clients via Kilolab.
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 15px 0;">✅ Prochaines étapes</h3>
            <ul style="color: #047857; padding-left: 20px;">
              <li style="margin: 10px 0;">Connectez-vous à votre dashboard</li>
              <li style="margin: 10px 0;">Configurez vos horaires d'ouverture</li>
              <li style="margin: 10px 0;">Commencez à recevoir des commandes !</li>
            </ul>
          </div>
          
          <a href="https://kilolab.fr/login" style="display: block; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">
            Accéder à mon dashboard
          </a>
          
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
            Des questions ? Contactez-nous à contact@kilolab.fr
          </p>
        </div>
        
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          © 2025 Kilolab - Le pressing au kilo
        </p>
      </body>
      </html>
    `
  })
};

// ============================================
// EMAIL SENDING (via Resend API)
// ============================================

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  if (!RESEND_API_KEY) {
    console.warn('Resend API key not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kilolab <noreply@kilolab.fr>',
        to: [to],
        subject,
        html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// ============================================
// PUSH NOTIFICATIONS
// ============================================

export const requestPushPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Push notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showLocalNotification = (title: string, body: string, icon?: string): void => {
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'kilolab-notification'
      // Note: vibrate removed as it's not supported in all browsers
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// ============================================
// HIGH-LEVEL NOTIFICATION FUNCTIONS
// ============================================

export const notifyNewOrder = async (
  order: OrderData,
  partner: PartnerData,
  user: UserData
): Promise<void> => {
  // Email au client
  const { subject, html } = emailTemplates.orderConfirmation(order, partner);
  await sendEmail(user.email, subject, html);

  // Email au pressing
  await sendEmail(
    partner.email,
    `📦 Nouvelle commande #${order.id.substring(0, 8).toUpperCase()}`,
    `<p>Nouvelle commande de ${user.email}</p><p>Poids: ${order.weight_kg}kg - Total: ${order.total_amount}€</p>`
  );
};

export const notifyOrderReady = async (
  order: OrderData,
  partner: PartnerData,
  userEmail: string
): Promise<void> => {
  // Email au client
  const { subject, html } = emailTemplates.orderReady(order, partner);
  await sendEmail(userEmail, subject, html);

  // Push notification
  showLocalNotification(
    '🎉 Votre linge est prêt !',
    `Rendez-vous chez ${partner.name} pour le récupérer.`
  );
};

export const notifyPartnerValidated = async (partner: PartnerData): Promise<void> => {
  const { subject, html } = emailTemplates.partnerValidated(partner);
  await sendEmail(partner.email, subject, html);
};

export default {
  sendEmail,
  requestPushPermission,
  showLocalNotification,
  notifyNewOrder,
  notifyOrderReady,
  notifyPartnerValidated
};
