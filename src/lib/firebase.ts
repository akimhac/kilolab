import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: any = null;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.warn('Firebase init failed:', e);
}

// Lazy init messaging only when supported
async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging) return messaging;
  try {
    const supported = await isSupported();
    if (supported && app) {
      messaging = getMessaging(app);
      return messaging;
    }
  } catch (e) {
    console.warn('Firebase Messaging not supported:', e);
  }
  return null;
}

// Fonction pour demander la permission et obtenir le token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!('Notification' in window)) return null;
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const msg = await getMessagingInstance();
      if (!msg) return null;
      const token = await getToken(msg, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.warn('Erreur obtention token FCM:', error);
    return null;
  }
};

// Écouter les messages en avant-plan
export const onMessageListener = () =>
  new Promise(async (resolve) => {
    try {
      const msg = await getMessagingInstance();
      if (msg) {
        onMessage(msg, (payload) => {
          resolve(payload);
        });
      }
    } catch (e) {
      console.warn('onMessage listener failed:', e);
    }
  });
