// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD2Du7gxgu6r-Lev2oSsh5Tv47Zlsz2WJ4",
  authDomain: "kilolab-prod.firebaseapp.com",
  projectId: "kilolab-prod",
  storageBucket: "kilolab-prod.firebasestorage.app",
  messagingSenderId: "835209922801",
  appId: "1:835209922801:web:0bcba3d5f93343e9a18150"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Kilolab';
  const notificationOptions = {
    body: payload.notification?.body || 'Nouvelle notification',
    icon: '/logo-192.png',
    badge: '/logo-72.png',
    tag: payload.data?.tag || 'kilolab-notification',
    data: payload.data,
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'close', title: 'Fermer' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  event.notification.close();

  if (event.action === 'close') return;

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('kilolab') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        const targetUrl = event.notification.data?.url || '/';
        return clients.openWindow(targetUrl);
      }
    })
  );
});
