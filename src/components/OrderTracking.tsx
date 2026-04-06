import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  User,
  Phone,
  MessageCircle,
  Navigation,
  Loader2,
  Sparkles,
  Home,
  Shirt
} from 'lucide-react';

type OrderStatus = 'pending' | 'assigned' | 'picked_up' | 'washing' | 'ready' | 'completed' | 'cancelled';

type TrackingData = {
  orderId: string;
  status: OrderStatus;
  washerName: string | null;
  washerPhone: string | null;
  washerPhoto: string | null;
  washerLocation: { lat: number; lng: number } | null;
  pickupAddress: string;
  estimatedTime: string;
  lastUpdate: string;
};

const STATUS_CONFIG: Record<OrderStatus, { 
  label: string; 
  icon: any; 
  color: string; 
  bgColor: string;
  message: string;
}> = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    message: 'Recherche d\'un Washer disponible...'
  },
  assigned: {
    label: 'Washer assigné',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    message: 'Un Washer va bientôt collecter votre linge'
  },
  picked_up: {
    label: 'Collecté',
    icon: Package,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    message: 'Votre linge a été collecté'
  },
  washing: {
    label: 'En lavage',
    icon: Sparkles,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    message: 'Votre linge est en cours de lavage'
  },
  ready: {
    label: 'Prêt',
    icon: Shirt,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    message: 'Votre linge est prêt, livraison en cours'
  },
  completed: {
    label: 'Livré',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    message: 'Votre linge a été livré !'
  },
  cancelled: {
    label: 'Annulé',
    icon: Clock,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    message: 'Commande annulée'
  }
};

const TRACKING_STEPS = [
  { status: 'pending', label: 'Commande reçue' },
  { status: 'assigned', label: 'Washer assigné' },
  { status: 'picked_up', label: 'Collecté' },
  { status: 'washing', label: 'En lavage' },
  { status: 'ready', label: 'Livraison' },
  { status: 'completed', label: 'Livré' },
];

export default function OrderTracking({ orderId }: { orderId: string }) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          pickup_address,
          created_at,
          updated_at,
          washer:washers(id, full_name, phone, lat, lng)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const washer = order.washer;
      
      // Calculate estimated time based on status
      let estimatedTime = '';
      switch (order.status) {
        case 'pending':
          estimatedTime = 'Assignation sous ~15 min';
          break;
        case 'assigned':
          estimatedTime = 'Collecte sous ~30 min';
          break;
        case 'picked_up':
        case 'washing':
          estimatedTime = 'Prêt dans ~24-48h';
          break;
        case 'ready':
          estimatedTime = 'Livraison sous ~1h';
          break;
        case 'completed':
          estimatedTime = 'Livré !';
          break;
        default:
          estimatedTime = '-';
      }

      setTracking({
        orderId: order.id,
        status: order.status as OrderStatus,
        washerName: washer?.full_name || null,
        washerPhone: washer?.phone || null,
        washerPhoto: null,
        washerLocation: washer?.lat && washer?.lng ? { lat: washer.lat, lng: washer.lng } : null,
        pickupAddress: order.pickup_address || 'Non spécifiée',
        estimatedTime,
        lastUpdate: order.updated_at || order.created_at,
      });
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchTracking();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      }, () => {
        fetchTracking();
      })
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchTracking, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [orderId, fetchTracking]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <Loader2 className="animate-spin text-teal-500 mx-auto mb-4" size={40} />
        <p className="text-slate-500">Chargement du suivi...</p>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-red-500">{error || 'Commande non trouvée'}</p>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[tracking.status];
  const StatusIcon = statusConfig.icon;
  const currentStepIndex = TRACKING_STEPS.findIndex(s => s.status === tracking.status);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header with animated status */}
      <div className={`${statusConfig.bgColor} p-6`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${statusConfig.bgColor} rounded-2xl flex items-center justify-center border-2 border-white/50`}>
            <StatusIcon size={32} className={statusConfig.color} />
          </div>
          <div>
            <p className={`text-sm font-bold ${statusConfig.color} uppercase tracking-wider`}>
              {statusConfig.label}
            </p>
            <p className="text-slate-700 font-medium mt-1">
              {statusConfig.message}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {tracking.estimatedTime}
            </p>
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%` }}
            />
          </div>
          
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.status} className="relative flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white' 
                    : 'bg-slate-200 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-teal-200 scale-110' : ''}`}>
                  {isCompleted ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <p className={`text-[10px] mt-2 font-medium text-center max-w-[60px] ${
                  isCompleted ? 'text-teal-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Washer info (if assigned) */}
      {tracking.washerName && (
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
            Votre Washer
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {tracking.washerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{tracking.washerName}</p>
                <p className="text-sm text-slate-500">Washer certifié</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {tracking.washerPhone && (
                <a 
                  href={`tel:${tracking.washerPhone}`}
                  className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 hover:bg-teal-200 transition"
                >
                  <Phone size={18} />
                </a>
              )}
              <button className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live map placeholder */}
      {tracking.washerLocation && ['assigned', 'picked_up', 'ready'].includes(tracking.status) && (
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
            Position en temps réel
          </p>
          <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            
            {/* Animated location marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-25" style={{ width: 60, height: 60, marginLeft: -15, marginTop: -15 }} />
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <Navigation size={16} className="text-white" />
                </div>
              </div>
            </div>

            {/* Info overlay */}
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
              <MapPin size={14} className="text-teal-500" />
              <span className="text-xs text-slate-700 font-medium">
                {tracking.status === 'assigned' ? 'En route vers vous' : 
                 tracking.status === 'ready' ? 'Livraison en cours' : 'Position du Washer'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="px-6 py-4">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
          Détails de la commande
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Home size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Adresse</p>
              <p className="text-sm font-medium text-slate-900">{tracking.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Dernière mise à jour</p>
              <p className="text-sm font-medium text-slate-900">
                {new Date(tracking.lastUpdate).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help button */}
      <div className="px-6 py-4 bg-slate-50">
        <button className="w-full py-3 text-teal-600 font-bold text-sm hover:bg-teal-50 rounded-xl transition">
          Besoin d'aide ? Contactez-nous
        </button>
      </div>
    </div>
  );
}
