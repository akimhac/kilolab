// Composant UI pour gérer les notifications push
import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X, Loader2, AlertCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  isNotificationSupported,
  getNotificationPermission,
  registerForPushNotifications,
  unsubscribeFromNotifications,
  onForegroundMessage,
} from '../services/pushNotifications';

interface NotificationSettingsProps {
  compact?: boolean;
  onStatusChange?: (enabled: boolean) => void;
}

export function NotificationSettings({ compact = false, onStatusChange }: NotificationSettingsProps) {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    checkStatus();
    
    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkStatus = () => {
    const isSupported = isNotificationSupported();
    setSupported(isSupported);
    
    if (isSupported) {
      const perm = getNotificationPermission();
      setPermission(perm);
      setEnabled(perm === 'granted');
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      const token = await registerForPushNotifications();
      if (token) {
        setEnabled(true);
        setPermission('granted');
        onStatusChange?.(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await unsubscribeFromNotifications();
      setEnabled(false);
      onStatusChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  // Compact version for navbar/settings
  if (compact) {
    if (!supported) {
      return (
        <div className="flex items-center gap-2 text-slate-400">
          <BellOff size={16} />
          <span className="text-xs">Non supporté</span>
        </div>
      );
    }

    return (
      <button
        onClick={enabled ? handleDisable : handleEnable}
        disabled={loading || permission === 'denied'}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
          enabled 
            ? 'bg-teal-100 text-teal-700' 
            : permission === 'denied'
              ? 'bg-red-50 text-red-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : enabled ? (
          <Bell size={16} />
        ) : (
          <BellOff size={16} />
        )}
        <span className="text-sm font-medium">
          {loading ? '...' : enabled ? 'Actif' : permission === 'denied' ? 'Bloqué' : 'Activer'}
        </span>
      </button>
    );
  }

  // Full card version
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            enabled ? 'bg-teal-100' : 'bg-slate-100'
          }`}>
            {enabled ? (
              <Bell className="text-teal-600" size={24} />
            ) : (
              <BellOff className="text-slate-400" size={24} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Notifications Push</h3>
            <p className="text-sm text-slate-500">
              {enabled ? 'Activées' : 'Désactivées'}
            </p>
          </div>
        </div>
        
        {supported && permission !== 'denied' && (
          <button
            onClick={enabled ? handleDisable : handleEnable}
            disabled={loading}
            className={`relative w-14 h-8 rounded-full transition-all ${
              enabled ? 'bg-teal-500' : 'bg-slate-200'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
              enabled ? 'left-7' : 'left-1'
            } flex items-center justify-center`}>
              {loading && <Loader2 size={12} className="animate-spin text-slate-400" />}
            </div>
          </button>
        )}
      </div>

      {!supported && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-amber-800">Non supporté</p>
            <p className="text-xs text-amber-600">
              Votre navigateur ne supporte pas les notifications push. Essayez Chrome ou Firefox.
            </p>
          </div>
        </div>
      )}

      {supported && permission === 'denied' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <X className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-red-800">Permission refusée</p>
            <p className="text-xs text-red-600">
              Vous avez bloqué les notifications. Pour les réactiver, modifiez les paramètres de votre navigateur.
            </p>
          </div>
        </div>
      )}

      {supported && permission !== 'denied' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Recevez des notifications pour :
          </p>
          <div className="space-y-2">
            {[
              { icon: '📦', label: 'Mises à jour de commande' },
              { icon: '👤', label: 'Attribution d\'un Washer' },
              { icon: '✅', label: 'Linge prêt' },
              { icon: '💬', label: 'Nouveaux messages' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span>{item.icon}</span>
                <span className="text-slate-700">{item.label}</span>
                {enabled && <Check size={14} className="text-green-500 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PWA Install hint */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-purple-500" />
          <p className="text-xs text-purple-700">
            <strong>Astuce :</strong> Installez l'app sur votre téléphone pour une meilleure expérience !
          </p>
        </div>
      </div>
    </div>
  );
}

// Mini notification bell for navbar
export function NotificationBell() {
  const [enabled, setEnabled] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (isNotificationSupported()) {
      setEnabled(getNotificationPermission() === 'granted');
    }
  }, []);

  return (
    <button
      onClick={() => {
        if (!enabled) {
          registerForPushNotifications().then(token => {
            if (token) setEnabled(true);
          });
        }
      }}
      className="relative p-2 hover:bg-slate-100 rounded-xl transition-all"
      title={enabled ? 'Notifications activées' : 'Activer les notifications'}
    >
      {enabled ? (
        <Bell size={20} className="text-slate-600" />
      ) : (
        <BellOff size={20} className="text-slate-400" />
      )}
      {hasNew && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}

export default NotificationSettings;
