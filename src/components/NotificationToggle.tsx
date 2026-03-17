import { useState, useEffect } from 'react';
import { Bell, BellOff, X, CheckCircle } from 'lucide-react';
import {
  isNotificationSupported,
  getNotificationPermission,
  registerForPushNotifications,
  unsubscribeFromNotifications,
} from '../services/pushNotifications';

type NotificationState = 'loading' | 'unsupported' | 'prompt' | 'granted' | 'denied';

export default function NotificationToggle() {
  const [state, setState] = useState<NotificationState>('loading');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    if (!isNotificationSupported()) {
      setState('unsupported');
      return;
    }

    const permission = getNotificationPermission();
    if (permission === 'granted') {
      setState('granted');
    } else if (permission === 'denied') {
      setState('denied');
    } else {
      setState('prompt');
    }
  };

  const handleEnable = async () => {
    setIsProcessing(true);
    try {
      const token = await registerForPushNotifications();
      if (token) {
        setState('granted');
      } else {
        checkPermission();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisable = async () => {
    setIsProcessing(true);
    try {
      await unsubscribeFromNotifications();
      setState('prompt');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state === 'loading') {
    return (
      <div className="bg-slate-100 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (state === 'unsupported') {
    return (
      <div className="bg-slate-100 rounded-xl p-4 flex items-center gap-3 text-slate-500">
        <BellOff size={20} />
        <span className="text-sm">Notifications non supportées sur ce navigateur</span>
      </div>
    );
  }

  if (state === 'denied') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-3 text-red-600 mb-2">
          <X size={20} />
          <span className="font-semibold">Notifications bloquées</span>
        </div>
        <p className="text-sm text-red-500">
          Pour activer les notifications, modifiez les paramètres de votre navigateur.
        </p>
      </div>
    );
  }

  if (state === 'granted') {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-teal-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-teal-800">Notifications activées</p>
              <p className="text-sm text-teal-600">
                Vous recevrez des alertes pour vos commandes
              </p>
            </div>
          </div>
          <button
            onClick={handleDisable}
            disabled={isProcessing}
            className="px-3 py-1.5 text-sm text-teal-600 hover:bg-teal-100 rounded-lg transition disabled:opacity-50"
          >
            {isProcessing ? 'Désactivation...' : 'Désactiver'}
          </button>
        </div>
      </div>
    );
  }

  // state === 'prompt'
  return (
    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <p className="font-bold">Activez les notifications</p>
            <p className="text-sm text-teal-100">
              Soyez alerté quand votre linge est prêt !
            </p>
          </div>
        </div>
        <button
          onClick={handleEnable}
          disabled={isProcessing}
          className="px-4 py-2 bg-white text-teal-600 rounded-lg font-bold text-sm hover:bg-teal-50 transition disabled:opacity-50"
        >
          {isProcessing ? 'Activation...' : 'Activer'}
        </button>
      </div>
    </div>
  );
}
