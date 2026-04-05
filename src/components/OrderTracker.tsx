// Suivi Commande en Temps Réel - Timeline live avec photos
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Package, Truck, CheckCircle, Clock, MapPin, Camera, 
  Phone, MessageCircle, Star, RefreshCw, Navigation
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderUpdate {
  status: string;
  timestamp: string;
  message: string;
  photo_url?: string;
}

interface OrderTracking {
  id: string;
  status: string;
  washer_name: string;
  washer_phone?: string;
  washer_photo?: string;
  washer_rating?: number;
  pickup_address: string;
  eta_minutes?: number;
  updates: OrderUpdate[];
  current_location?: { lat: number; lng: number };
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  pending: { icon: <Clock size={20} />, color: 'text-orange-500', bg: 'bg-orange-100', label: 'En attente' },
  confirmed: { icon: <CheckCircle size={20} />, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Confirmée' },
  assigned: { icon: <Package size={20} />, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Washer assigné' },
  picking_up: { icon: <Truck size={20} />, color: 'text-cyan-500', bg: 'bg-cyan-100', label: 'En route pour collecte' },
  picked_up: { icon: <Package size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-100', label: 'Linge collecté' },
  washing: { icon: <RefreshCw size={20} />, color: 'text-teal-500', bg: 'bg-teal-100', label: 'Lavage en cours' },
  drying: { icon: <RefreshCw size={20} />, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Séchage en cours' },
  ready: { icon: <CheckCircle size={20} />, color: 'text-green-500', bg: 'bg-green-100', label: 'Prêt pour livraison' },
  delivering: { icon: <Truck size={20} />, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Livraison en cours' },
  completed: { icon: <Star size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Livré' },
};

const STATUS_STEPS = ['pending', 'assigned', 'picked_up', 'washing', 'ready', 'completed'];

export function OrderTracker({ orderId }: { orderId: string }) {
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    fetchTracking();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order_${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, () => {
        fetchTracking();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const fetchTracking = async () => {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          washer:washers(first_name, last_name, phone, avg_rating)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      // Build timeline from status changes
      const updates: OrderUpdate[] = [];
      
      if (order.created_at) {
        updates.push({
          status: 'pending',
          timestamp: order.created_at,
          message: 'Commande reçue'
        });
      }
      
      if (order.assigned_at) {
        updates.push({
          status: 'assigned',
          timestamp: order.assigned_at,
          message: `${order.washer?.first_name || 'Washer'} a accepté votre commande`
        });
      }
      
      if (order.picked_up_at) {
        updates.push({
          status: 'picked_up',
          timestamp: order.picked_up_at,
          message: 'Votre linge a été collecté',
          photo_url: order.pickup_photo_url
        });
      }
      
      if (order.washing_started_at) {
        updates.push({
          status: 'washing',
          timestamp: order.washing_started_at,
          message: 'Lavage et séchage en cours'
        });
      }
      
      if (order.ready_at) {
        updates.push({
          status: 'ready',
          timestamp: order.ready_at,
          message: 'Votre linge est prêt !',
          photo_url: order.ready_photo_url
        });
      }
      
      if (order.completed_at) {
        updates.push({
          status: 'completed',
          timestamp: order.completed_at,
          message: 'Livré avec succès',
          photo_url: order.delivery_photo_url
        });
      }

      setTracking({
        id: order.id,
        status: order.status,
        washer_name: order.washer ? `${order.washer.first_name} ${order.washer.last_name?.[0] || ''}.` : 'En attente',
        washer_phone: order.washer?.phone,
        washer_photo: null,
        washer_rating: order.washer?.avg_rating,
        pickup_address: order.pickup_address,
        eta_minutes: order.eta_minutes,
        updates: updates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        current_location: order.washer_lat && order.washer_lng ? { lat: order.washer_lat, lng: order.washer_lng } : undefined,
      });
    } catch (error) {
      console.error('Error fetching tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tracking) return null;

  const statusConfig = STATUS_CONFIG[tracking.status] || STATUS_CONFIG.pending;
  const currentStepIndex = STATUS_STEPS.indexOf(tracking.status);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header with status */}
      <div className={`${statusConfig.bg} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${statusConfig.bg} border-2 border-white flex items-center justify-center ${statusConfig.color}`}>
              {statusConfig.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{statusConfig.label}</h3>
              {tracking.eta_minutes && tracking.status !== 'completed' && (
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <Clock size={14} /> ETA: ~{tracking.eta_minutes} min
                </p>
              )}
            </div>
          </div>
          <button onClick={fetchTracking} className="p-2 hover:bg-white/50 rounded-xl transition-all">
            <RefreshCw size={20} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 rounded-full" />
          <div 
            className="absolute top-4 left-0 h-1 bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-teal-100 scale-110' : ''}`}>
                  {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                </div>
                <span className={`text-xs mt-2 ${isCompleted ? 'text-teal-600 font-medium' : 'text-slate-400'}`}>
                  {STATUS_CONFIG[step]?.label?.split(' ')[0] || step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Washer info */}
      {tracking.washer_name !== 'En attente' && (
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tracking.washer_photo ? (
                <img src={tracking.washer_photo} alt={tracking.washer_name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {tracking.washer_name[0]}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900">{tracking.washer_name}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span>{tracking.washer_rating?.toFixed(1) || '4.8'}</span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">VÉRIFIÉ</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {tracking.washer_phone && (
                <a href={`tel:${tracking.washer_phone}`} className="p-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all">
                  <Phone size={18} />
                </a>
              )}
              <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="p-6">
        <h4 className="font-bold text-slate-900 mb-4">Historique</h4>
        <div className="space-y-4">
          {tracking.updates.map((update, idx) => {
            const config = STATUS_CONFIG[update.status] || STATUS_CONFIG.pending;
            return (
              <div key={idx} className="flex gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center ${config.color}`}>
                    {config.icon}
                  </div>
                  {idx < tracking.updates.length - 1 && (
                    <div className="absolute top-10 left-1/2 w-0.5 h-6 bg-slate-200 -translate-x-1/2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-slate-900">{update.message}</p>
                  <p className="text-sm text-slate-500">
                    {format(new Date(update.timestamp), "d MMM 'à' HH:mm", { locale: fr })}
                  </p>
                  {update.photo_url && (
                    <button 
                      onClick={() => setShowPhotos(true)}
                      className="mt-2 flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
                    >
                      <Camera size={14} /> Voir la photo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Address */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="text-teal-500" />
          <span>{tracking.pickup_address}</span>
        </div>
      </div>
    </div>
  );
}

// Compact tracker for dashboard
export function OrderTrackerMini({ orderId, status }: { orderId: string; status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const currentStepIndex = STATUS_STEPS.indexOf(status);
  const progress = (currentStepIndex / (STATUS_STEPS.length - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
          {config.icon}
        </div>
        <span className="font-bold text-slate-900 text-sm">{config.label}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>Commande</span>
        <span>Livré</span>
      </div>
    </div>
  );
}

export default OrderTracker;
