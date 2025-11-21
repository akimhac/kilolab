import { useState, useEffect } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Vérifier le support
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.error('❌ Notifications non supportées');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      console.log('🔔 Permission notifications:', result);
      return result === 'granted';
    } catch (error) {
      console.error('❌ Erreur permission:', error);
      return false;
    }
  };

  const subscribeToPush = async (vapidPublicKey: string): Promise<PushSubscription | null> => {
    if (!isSupported) {
      console.error('❌ Push non supporté');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        return existingSubscription;
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(newSubscription);
      console.log('✅ Subscription créée');
      
      // Envoyer au backend
      await sendSubscriptionToServer(newSubscription);
      
      return newSubscription;
    } catch (error) {
      console.error('❌ Erreur subscription:', error);
      return null;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      const success = await subscription.unsubscribe();
      if (success) {
        setSubscription(null);
        console.log('✅ Désinscrit des notifications');
      }
      return success;
    } catch (error) {
      console.error('❌ Erreur désinscription:', error);
      return false;
    }
  };

  const sendNotification = async (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.warn('⚠️ Permission non accordée');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });
    } catch (error) {
      console.error('❌ Erreur envoi notification:', error);
    }
  };

  return {
    permission,
    isSupported,
    hasPermission: permission === 'granted',
    requestPermission,
    subscribeToPush,
    unsubscribe,
    sendNotification,
    subscription
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    // TODO: Remplacer par votre endpoint backend
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Erreur serveur');
    }

    console.log('✅ Subscription envoyée au serveur');
  } catch (error) {
    console.error('❌ Erreur envoi subscription:', error);
  }
}
