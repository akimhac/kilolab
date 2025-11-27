// src/pages/OrderTracking.tsx
// Page de tracking de commande avec timeline et QR code

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin, 
  Phone, QrCode, Share2, Download, Copy, RefreshCw,
  AlertCircle, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  user_id: string;
  partner_id: string;
  weight_kg: number;
  service_type: 'standard' | 'express';
  price_per_kg: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  pickup_date?: string;
  delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

interface TrackingEvent {
  status: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

const statusConfig: Record<string, { label: string; description: string; icon: any; color: string }> = {
  pending: {
    label: 'Commande reçue',
    description: 'Votre commande a été enregistrée',
    icon: Package,
    color: 'yellow'
  },
  confirmed: {
    label: 'Confirmée',
    description: 'Le pressing a confirmé votre commande',
    icon: CheckCircle,
    color: 'blue'
  },
  in_progress: {
    label: 'En cours de traitement',
    description: 'Votre linge est en train d\'être nettoyé',
    icon: RefreshCw,
    color: 'purple'
  },
  ready: {
    label: 'Prêt à récupérer',
    description: 'Votre linge est prêt ! Venez le chercher',
    icon: CheckCircle,
    color: 'green'
  },
  completed: {
    label: 'Terminée',
    description: 'Commande récupérée. Merci !',
    icon: Star,
    color: 'green'
  },
  cancelled: {
    label: 'Annulée',
    description: 'Cette commande a été annulée',
    icon: AlertCircle,
    color: 'red'
  }
};

const statusOrder = ['pending', 'confirmed', 'in_progress', 'ready', 'completed'];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(loadOrderDetails, 30000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      // Charger la commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Charger le partenaire
      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('id', orderData.partner_id)
        .single();

      setPartner(partnerData);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Commande introuvable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrderDetails();
  };

  const handleShare = async () => {
    const url = `https://kilolab.fr/tracking/${orderId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Commande Kilolab #${orderId?.slice(0, 8)}`,
          text: 'Suivez ma commande de pressing',
          url
        });
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Lien copié !');
  };

  const downloadQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      `KILOLAB:${orderId}`
    )}`;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `kilolab-${orderId?.slice(0, 8)}.png`;
    link.click();
    toast.success('QR Code téléchargé !');
  };

  const getTrackingEvents = (): TrackingEvent[] => {
    if (!order) return [];

    const currentIndex = statusOrder.indexOf(order.status);
    
    return statusOrder.map((status, index) => {
      const config = statusConfig[status];
      return {
        status,
        label: config.label,
        description: config.description,
        icon: config.icon,
        color: config.color,
        completed: index < currentIndex || (index === currentIndex && status === 'completed'),
        current: index === currentIndex,
        timestamp: index <= currentIndex ? order.updated_at : undefined
      };
    });
  };

  const getEstimatedTime = (): string => {
    if (!order) return '';
    
    const created = new Date(order.created_at);
    const isExpress = order.service_type === 'express';
    const hoursToAdd = isExpress ? 4 : 24;
    const estimated = new Date(created.getTime() + hoursToAdd * 60 * 60 * 1000);
    
    return estimated.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du suivi...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Commande introuvable</h2>
          <p className="text-slate-600 mb-4">Cette commande n'existe pas ou a été supprimée.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const trackingEvents = getTrackingEvents();
  const currentConfig = statusConfig[order.status];
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `KILOLAB:${orderId}`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className={`p-2 hover:bg-slate-100 rounded-lg transition ${refreshing ? 'animate-spin' : ''}`}
                disabled={refreshing}
              >
                <RefreshCw className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Numéro de commande */}
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 mb-1">Commande</p>
          <h1 className="text-2xl font-bold text-slate-900">
            #{orderId?.slice(0, 8).toUpperCase()}
          </h1>
        </div>

        {/* Statut actuel */}
        <div className={`bg-gradient-to-r ${
          currentConfig.color === 'green' ? 'from-green-500 to-emerald-600' :
          currentConfig.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
          currentConfig.color === 'blue' ? 'from-blue-500 to-cyan-500' :
          currentConfig.color === 'purple' ? 'from-purple-500 to-pink-500' :
          'from-red-500 to-rose-500'
        } rounded-3xl p-6 text-white mb-6 shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <currentConfig.icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentConfig.label}</h2>
              <p className="text-white/80">{currentConfig.description}</p>
            </div>
          </div>

          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/70">Estimation</p>
              <p className="font-semibold">{getEstimatedTime()}</p>
            </div>
          )}
        </div>

        {/* QR Code (si prêt) */}
        {(order.status === 'ready' || order.status === 'completed') && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-purple-600" />
              QR Code de retrait
            </h3>
            
            <div 
              className="inline-block bg-white p-4 rounded-2xl border-4 border-purple-100 cursor-pointer hover:border-purple-300 transition"
              onClick={() => setShowQR(true)}
            >
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-slate-600 mt-4 mb-4">
              Présentez ce code au pressing pour récupérer votre linge
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              <button
                onClick={() => copyToClipboard(`KILOLAB:${orderId}`)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copier le code
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Suivi de votre commande</h3>
          
          <div className="relative">
            {trackingEvents.map((event, index) => (
              <div key={event.status} className="flex gap-4 mb-6 last:mb-0">
                {/* Ligne verticale */}
                {index < trackingEvents.length - 1 && (
                  <div className={`absolute left-[19px] top-[40px] w-0.5 h-[calc(100%-40px)] ${
                    event.completed ? 'bg-green-400' : 'bg-slate-200'
                  }`} style={{ 
                    top: `${index * 80 + 40}px`,
                    height: '60px'
                  }}></div>
                )}

                {/* Icône */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  event.completed ? 'bg-green-500 text-white' :
                  event.current ? `bg-${event.color}-500 text-white` :
                  'bg-slate-200 text-slate-400'
                }`}>
                  <event.icon className="w-5 h-5" />
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <p className={`font-semibold ${
                    event.completed || event.current ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {event.label}
                  </p>
                  <p className={`text-sm ${
                    event.completed || event.current ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {event.description}
                  </p>
                  {event.timestamp && (
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(event.timestamp).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détails de la commande */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Détails</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Service</span>
              <span className="font-semibold">
                {order.service_type === 'express' ? '⚡ Express' : '📦 Standard'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Poids</span>
              <span className="font-semibold">{order.weight_kg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Prix au kg</span>
              <span className="font-semibold">{order.price_per_kg}€</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-lg font-bold text-purple-600">{order.total_amount}€</span>
            </div>
          </div>
        </div>

        {/* Pressing */}
        {partner && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Pressing
            </h3>
            
            <div className="mb-4">
              <p className="font-semibold text-slate-900">{partner.name}</p>
              <p className="text-slate-600">{partner.address}</p>
              <p className="text-slate-600">{partner.postal_code} {partner.city}</p>
            </div>

            <div className="flex gap-3">
              {partner.phone && (
                <a
                  href={`tel:${partner.phone}`}
                  className="flex-1 py-3 bg-purple-100 text-purple-700 rounded-xl font-semibold text-center hover:bg-purple-200 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Appeler
                </a>
              )}
              {partner.latitude && partner.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-center hover:bg-slate-200 transition flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Itinéraire
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bouton avis (si terminée) */}
        {order.status === 'completed' && (
          <button
            onClick={() => navigate(`/review/${orderId}`)}
            className="w-full mt-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Laisser un avis
          </button>
        )}
      </div>

      {/* Modal QR Code plein écran */}
      {showQR && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-full max-w-[300px] mx-auto"
            />
            <p className="text-2xl font-bold text-purple-600 mt-4">
              #{orderId?.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-slate-500 mt-2">
              Présentez ce code au pressing
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-6 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
