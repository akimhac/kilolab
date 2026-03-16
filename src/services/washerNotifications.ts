// Washer Notification Service
// Uses Supabase Realtime (free) + Email via Resend

import { supabase } from '../lib/supabase';

interface WasherNotification {
  washer_id: string;
  washer_email: string;
  washer_name: string;
  type: 'new_client_in_zone' | 'new_order' | 'zone_activated';
  data: Record<string, any>;
}

// Subscribe to new clients in a washer's zone
export function subscribeToZoneClients(
  washerId: string, 
  city: string,
  onNewClient: (client: any) => void
) {
  const channel = supabase
    .channel(`zone-${city}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_profiles',
        filter: `city=eq.${city}`
      },
      (payload) => {
        onNewClient(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Subscribe to new orders in a washer's zone
export function subscribeToZoneOrders(
  washerId: string,
  postalCodes: string[],
  onNewOrder: (order: any) => void
) {
  const channel = supabase
    .channel(`orders-${washerId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        // Check if order is in washer's zone
        const orderPostalCode = payload.new.pickup_postal_code;
        if (postalCodes.some(pc => orderPostalCode?.startsWith(pc.slice(0, 2)))) {
          onNewOrder(payload.new);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Send email notification to washer
export async function sendWasherEmailNotification(notification: WasherNotification) {
  try {
    let subject = '';
    let html = '';

    switch (notification.type) {
      case 'new_client_in_zone':
        subject = '👤 Nouveau client dans votre zone !';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #a855f7); padding: 20px; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">👤 Nouveau client !</h1>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 16px 16px;">
              <p style="color: #334155;">Bonjour ${notification.washer_name},</p>
              <p style="color: #334155;">Un nouveau client vient de s'inscrire dans votre zone !</p>
              <p style="color: #64748b; font-size: 14px;">Restez disponible, une commande pourrait arriver bientôt.</p>
              <a href="https://kilolab.fr/washer-dashboard" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
                Voir mon dashboard
              </a>
            </div>
          </div>
        `;
        break;

      case 'new_order':
        subject = '🛒 Nouvelle commande disponible !';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #14b8a6, #06b6d4); padding: 20px; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">🛒 Nouvelle commande !</h1>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 16px 16px;">
              <p style="color: #334155;">Bonjour ${notification.washer_name},</p>
              <p style="color: #334155;"><strong>Une nouvelle commande est disponible dans votre zone !</strong></p>
              <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #14b8a6;">
                <p style="margin: 4px 0; color: #334155;"><strong>Poids :</strong> ${notification.data.weight || '?'} kg</p>
                <p style="margin: 4px 0; color: #334155;"><strong>Adresse :</strong> ${notification.data.address || 'Non précisée'}</p>
                <p style="margin: 4px 0; color: #10b981; font-size: 18px;"><strong>Gain :</strong> ${notification.data.earnings || '?'} €</p>
              </div>
              <a href="https://kilolab.fr/washer-dashboard" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Accepter la commande
              </a>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">Répondez vite, les commandes partent rapidement !</p>
            </div>
          </div>
        `;
        break;

      case 'zone_activated':
        subject = '🎉 Votre zone est activée !';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 20px; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">🎉 Félicitations !</h1>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 16px 16px;">
              <p style="color: #334155;">Bonjour ${notification.washer_name},</p>
              <p style="color: #334155;"><strong>Votre zone vient d'être activée !</strong></p>
              <p style="color: #334155;">Vous pouvez maintenant recevoir des commandes de clients dans votre secteur.</p>
              <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="color: #059669; margin: 0; font-weight: bold;">Prêt à gagner de l'argent avec Kilolab ?</p>
              </div>
              <a href="https://kilolab.fr/washer-dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Commencer maintenant
              </a>
            </div>
          </div>
        `;
        break;
    }

    // Send via API
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: notification.washer_email,
        subject: `Kilolab - ${subject}`,
        html
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send washer notification:', error);
    return false;
  }
}

// Request browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
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

// Show browser notification (free, no service needed)
export function showBrowserNotification(title: string, body: string, icon?: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'kilolab-notification',
      requireInteraction: true
    });
  }
}

export default {
  subscribeToZoneClients,
  subscribeToZoneOrders,
  sendWasherEmailNotification,
  requestNotificationPermission,
  showBrowserNotification
};
