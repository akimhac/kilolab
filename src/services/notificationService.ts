// src/services/notificationService.ts
// Service de notifications simplifié

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  // TODO: Implémenter avec Resend quand configuré
  console.log('Email would be sent to:', to, subject);
  return true;
};

export const showLocalNotification = (title: string, body: string): void => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: '/icon-192.png'
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
};

export const requestPushPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export default {
  sendEmail,
  showLocalNotification,
  requestPushPermission
};
