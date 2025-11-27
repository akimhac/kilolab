import { supabase } from '../lib/supabase';

const RESEND_API_KEY = 're_YOUR_API_KEY'; // À remplacer par ta clé Resend
const FROM_EMAIL = 'Kilolab <contact@kilolab.fr>';

// Types
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, any>;
}

// ============================================
// EMAIL NOTIFICATIONS (Resend)
// ============================================

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo || 'contact@kilolab.fr',
      }),
    });

    if (!response.ok) {
      console.error('Erreur Resend:', await response.text());
      return false;
    }

    console.log('✅ Email envoyé à:', options.to);
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

// Templates d'emails
export const emailTemplates = {
  // Email de confirmation de commande
  orderConfirmation: (order: any, partner: any, user: any) => ({
    subject: `✅ Commande #${order.id.slice(0, 8)} confirmée - Kilolab`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed, #db2777); padding: 30px; text-align: center; border-radius: 16px 16px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; }
          .order-box { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .total { font-size: 24px; color: #7c3aed; font-weight: bold; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧺 Commande Confirmée !</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${user.name || 'cher client'}</strong>,</p>
            <p>Votre commande a bien été enregistrée et sera traitée par <strong>${partner.name}</strong>.</p>
            
            <div class="order-box">
              <h3 style="margin-top: 0;">📦 Détails de la commande</h3>
              <div class="detail-row">
                <span>N° de commande</span>
                <strong>#${order.id.slice(0, 8)}</strong>
              </div>
              <div class="detail-row">
                <span>Service</span>
                <strong>${order.service_type === 'express' ? '⚡ Express' : '📦 Standard'}</strong>
              </div>
              <div class="detail-row">
                <span>Poids estimé</span>
                <strong>${order.weight_kg} kg</strong>
              </div>
              <div class="detail-row">
                <span>Prix au kg</span>
                <strong>${order.price_per_kg}€/kg</strong>
              </div>
              <div class="detail-row" style="border: none; padding-top: 16px;">
                <span style="font-size: 18px;">Total</span>
                <span class="total">${order.total_amount}€</span>
              </div>
            </div>

            <div class="order-box">
              <h3 style="margin-top: 0;">📍 Pressing</h3>
              <p style="margin: 0;"><strong>${partner.name}</strong></p>
              <p style="margin: 5px 0; color: #64748b;">${partner.address}</p>
              <p style="margin: 5px 0; color: #64748b;">${partner.postal_code} ${partner.city}</p>
              ${partner.phone ? `<p style="margin: 5px 0;">📞 ${partner.phone}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kilolab.fr/client-dashboard" class="button">
                Suivre ma commande
              </a>
            </div>

            <p style="color: #64748b; font-size: 14px;">
              Vous recevrez une notification dès que votre linge sera prêt à être récupéré.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Kilolab - Le pressing au kilo</p>
            <p><a href="https://kilolab.fr" style="color: #7c3aed;">kilolab.fr</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email linge prêt
  orderReady: (order: any, partner: any, user: any, qrCodeUrl: string) => ({
    subject: `🎉 Votre linge est prêt ! - Commande #${order.id.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 16px 16px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; }
          .qr-box { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .qr-code { width: 200px; height: 200px; margin: 20px auto; }
          .button { display: inline-block; background: #10b981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Votre linge est prêt !</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${user.name || 'cher client'}</strong>,</p>
            <p>Excellente nouvelle ! Votre linge est prêt à être récupéré chez <strong>${partner.name}</strong>.</p>
            
            <div class="qr-box">
              <h3 style="margin-top: 0;">📱 Votre QR Code de retrait</h3>
              <p style="color: #64748b;">Présentez ce code au pressing pour récupérer votre linge</p>
              <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
              <p style="font-size: 24px; font-weight: bold; color: #7c3aed; margin: 20px 0;">
                #${order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0;">📍 Adresse du pressing</h3>
              <p style="margin: 0;"><strong>${partner.name}</strong></p>
              <p style="margin: 5px 0; color: #64748b;">${partner.address}</p>
              <p style="margin: 5px 0; color: #64748b;">${partner.postal_code} ${partner.city}</p>
              ${partner.phone ? `<p style="margin: 10px 0;"><a href="tel:${partner.phone}" style="color: #7c3aed;">📞 ${partner.phone}</a></p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kilolab.fr/pickup/${order.id}" class="button">
                Voir les détails
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Kilolab - Le pressing au kilo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email nouveau partenaire (pour admin)
  newPartnerRequest: (partner: any) => ({
    subject: `🏪 Nouvelle demande partenaire : ${partner.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 16px 16px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; }
          .info-box { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0;">🏪 Nouvelle demande partenaire</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>${partner.name}</h3>
              <p><strong>Email:</strong> ${partner.email}</p>
              <p><strong>Téléphone:</strong> ${partner.phone || 'Non renseigné'}</p>
              <p><strong>Adresse:</strong> ${partner.address}</p>
              <p><strong>Ville:</strong> ${partner.postal_code} ${partner.city}</p>
              <p><strong>SIRET:</strong> ${partner.siret || 'Non renseigné'}</p>
              ${partner.description ? `<p><strong>Description:</strong> ${partner.description}</p>` : ''}
            </div>
            <div style="text-align: center;">
              <a href="https://kilolab.fr/admin-dashboard" class="button">
                Valider sur le dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email partenaire validé
  partnerValidated: (partner: any) => ({
    subject: `🎉 Bienvenue chez Kilolab - Votre compte est activé !`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 16px 16px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; }
          .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0;">🎉 Félicitations !</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${partner.name}</strong>,</p>
            <p>Excellente nouvelle ! Votre demande de partenariat a été <strong style="color: #10b981;">validée</strong>.</p>
            <p>Vous faites maintenant partie du réseau Kilolab et pouvez recevoir des commandes de nos clients.</p>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0;">🚀 Prochaines étapes</h3>
              <ol style="padding-left: 20px;">
                <li>Connectez-vous à votre dashboard partenaire</li>
                <li>Vérifiez vos informations et horaires</li>
                <li>Définissez votre tarif au kilo</li>
                <li>Commencez à recevoir des commandes !</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kilolab.fr/partner-dashboard" class="button">
                Accéder à mon dashboard
              </a>
            </div>

            <p style="color: #64748b;">
              Des questions ? Contactez-nous à <a href="mailto:contact@kilolab.fr" style="color: #7c3aed;">contact@kilolab.fr</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// ============================================
// PUSH NOTIFICATIONS (Service Worker)
// ============================================

// Demander la permission pour les notifications push
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Les notifications ne sont pas supportées');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Enregistrer le service worker pour les push
export async function registerPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'YOUR_VAPID_PUBLIC_KEY' // À générer avec web-push
      )
    });

    // Sauvegarder la subscription dans Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription: JSON.stringify(subscription),
          created_at: new Date().toISOString()
        });
    }

    return subscription;
  } catch (error) {
    console.error('Erreur inscription push:', error);
    return null;
  }
}

// Afficher une notification locale
export function showLocalNotification(payload: NotificationPayload): void {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: payload.data,
    vibrate: [200, 100, 200]
  });

  notification.onclick = () => {
    if (payload.url) {
      window.open(payload.url, '_blank');
    }
    notification.close();
  };
}

// ============================================
// NOTIFICATIONS IN-APP
// ============================================

interface InAppNotification {
  id: string;
  user_id: string;
  type: 'order' | 'review' | 'promo' | 'system';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
}

// Créer une notification in-app
export async function createInAppNotification(
  userId: string,
  type: InAppNotification['type'],
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        read: false,
        data,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Erreur création notification:', error);
  }
}

// Récupérer les notifications d'un utilisateur
export async function getUserNotifications(userId: string): Promise<InAppNotification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    return [];
  }
}

// Marquer comme lu
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  } catch (error) {
    console.error('Erreur marquage notification:', error);
  }
}

// Marquer toutes comme lues
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
  } catch (error) {
    console.error('Erreur marquage notifications:', error);
  }
}

// ============================================
// HELPERS
// ============================================

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ============================================
// FONCTIONS DE HAUT NIVEAU
// ============================================

// Notifier une nouvelle commande
export async function notifyNewOrder(order: any, partner: any, user: any): Promise<void> {
  // Email au client
  const clientEmail = emailTemplates.orderConfirmation(order, partner, user);
  await sendEmail({
    to: user.email,
    subject: clientEmail.subject,
    html: clientEmail.html
  });

  // Email au pressing
  await sendEmail({
    to: partner.email,
    subject: `📦 Nouvelle commande #${order.id.slice(0, 8)}`,
    html: `
      <h2>Nouvelle commande reçue !</h2>
      <p><strong>Client:</strong> ${user.name || user.email}</p>
      <p><strong>Poids:</strong> ${order.weight_kg} kg</p>
      <p><strong>Service:</strong> ${order.service_type}</p>
      <p><strong>Total:</strong> ${order.total_amount}€</p>
      <p><a href="https://kilolab.fr/partner-dashboard">Voir dans le dashboard</a></p>
    `
  });

  // Notification in-app
  await createInAppNotification(
    user.id,
    'order',
    'Commande confirmée',
    `Votre commande #${order.id.slice(0, 8)} a été enregistrée`,
    { orderId: order.id }
  );
}

// Notifier que le linge est prêt
export async function notifyOrderReady(order: any, partner: any, user: any): Promise<void> {
  // Générer le QR Code URL (utiliser un service comme QR Server)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `KILOLAB:${order.id}`
  )}`;

  // Email au client
  const readyEmail = emailTemplates.orderReady(order, partner, user, qrCodeUrl);
  await sendEmail({
    to: user.email,
    subject: readyEmail.subject,
    html: readyEmail.html
  });

  // Notification push
  showLocalNotification({
    title: '🎉 Linge prêt !',
    body: `Votre commande est prête chez ${partner.name}`,
    url: `https://kilolab.fr/pickup/${order.id}`
  });

  // Notification in-app
  await createInAppNotification(
    user.id,
    'order',
    'Linge prêt à récupérer',
    `Votre linge est prêt chez ${partner.name}`,
    { orderId: order.id, qrCodeUrl }
  );
}

export default {
  sendEmail,
  emailTemplates,
  requestPushPermission,
  registerPushSubscription,
  showLocalNotification,
  createInAppNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  notifyNewOrder,
  notifyOrderReady
};
