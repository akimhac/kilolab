// Service de Notifications Push Firebase
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2Du7gxgu6r-Lev2oSsh5Tv47Zlsz2WJ4",
  authDomain: "kilolab-prod.firebaseapp.com",
  projectId: "kilolab-prod",
  storageBucket: "kilolab-prod.firebasestorage.app",
  messagingSenderId: "835209922801",
  appId: "1:835209922801:web:0bcba3d5f93343e9a18150"
};

// VAPID Key for web push
const VAPID_KEY = 'BKRr8sXq8u2rL5xyZv3hX2JnX9Pf8Kj4Y7Wm1N6Qp0Rt5Yz3Ab7Cd9Ef2Gh4Ij6Kl';

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

// Initialize Firebase
function initFirebase(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Check if messaging is supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      messaging = getMessaging(app);
      return true;
    }
    
    console.warn('Push notifications not supported in this browser');
    return false;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 
         'Notification' in window && 
         'serviceWorker' in navigator &&
         'PushManager' in window;
}

// Get current permission status
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

// Register service worker and get FCM token
export async function registerForPushNotifications(): Promise<string | null> {
  if (!isNotificationSupported()) {
    toast.error('Les notifications ne sont pas supportées sur ce navigateur');
    return null;
  }

  try {
    // Request permission first
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      toast.error('Permission refusée pour les notifications');
      return null;
    }

    // Initialize Firebase
    if (!initFirebase() || !messaging) {
      throw new Error('Firebase messaging not available');
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      
      // Save token to database
      await saveTokenToDatabase(token);
      
      toast.success('Notifications activées !');
      return token;
    } else {
      console.warn('No FCM token received');
      return null;
    }
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    toast.error('Erreur lors de l\'activation des notifications');
    return null;
  }
}

// Save FCM token to database
async function saveTokenToDatabase(token: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update user profile with FCM token
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        fcm_token: token,
        notifications_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving FCM token:', error);
    }
  } catch (error) {
    console.error('Error saving token to database:', error);
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback: (payload: MessagePayload) => void): (() => void) | null {
  if (!initFirebase() || !messaging) {
    return null;
  }

  return onMessage(messaging, (payload) => {
    
    // Show toast notification
    const title = payload.notification?.title || 'Kilolab';
    const body = payload.notification?.body || 'Nouvelle notification';
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                <span className="text-xl">🔔</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{body}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-500 focus:outline-none"
          >
            Fermer
          </button>
        </div>
      </div>
    ), { duration: 5000 });

    callback(payload);
  });
}

// Unsubscribe from notifications
export async function unsubscribeFromNotifications(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update database
    await supabase
      .from('user_profiles')
      .update({ 
        fcm_token: null,
        notifications_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    toast.success('Notifications désactivées');
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
  }
}

// Send test notification (admin only)
export async function sendTestNotification(userId: string, title: string, body: string): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        userId,
        title,
        body,
        data: { type: 'test' },
      },
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
}

export default {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerForPushNotifications,
  onForegroundMessage,
  unsubscribeFromNotifications,
  sendTestNotification,
};
