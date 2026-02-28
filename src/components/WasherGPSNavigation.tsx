import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Navigation, MapPin, Phone, MessageCircle, Clock, CheckCircle, Package, Truck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface OrderLocation {
  id: string;
  clientName: string;
  address: string;
  city: string;
  phone: string;
  status: 'pickup' | 'delivery';
  estimatedTime: number;
  distance: string;
  weight: string;
}

export default function WasherGPSNavigation() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderLocation[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderLocation | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [eta, setEta] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real orders from Supabase
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          pickup_address,
          delivery_address,
          status,
          estimated_weight,
          profiles!orders_client_id_fkey (full_name, phone)
        `)
        .in('status', ['pending', 'accepted', 'washing', 'ready'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform Supabase data to our format
      const transformedOrders: OrderLocation[] = (data || []).map((order: any, idx: number) => {
        const isPickup = ['pending', 'accepted'].includes(order.status);
        const address = isPickup ? order.pickup_address : order.delivery_address;
        const cityMatch = address?.match(/\d{5}\s+([A-Za-zÀ-ÿ\s-]+)/);
        
        return {
          id: `ORD-${order.id.slice(0, 4).toUpperCase()}`,
          clientName: order.profiles?.full_name || 'Client',
          address: address?.split(',')[0] || 'Adresse non spécifiée',
          city: cityMatch?.[1]?.trim() || 'France',
          phone: order.profiles?.phone || '06 00 00 00 00',
          status: isPickup ? 'pickup' : 'delivery',
          estimatedTime: 10 + idx * 5,
          distance: `${(1.5 + idx * 0.8).toFixed(1)} km`,
          weight: `${order.estimated_weight || '3.0'} kg`,
        };
      });

      // If no real orders, use fallback mock data for demo
      if (transformedOrders.length === 0) {
        transformedOrders.push(
          {
            id: 'ORD-DEMO1',
            clientName: 'Marie Dupont',
            address: '15 Rue de la République',
            city: 'Lille',
            phone: '06 12 34 56 78',
            status: 'pickup',
            estimatedTime: 12,
            distance: '2.3 km',
            weight: '5.2 kg',
          },
          {
            id: 'ORD-DEMO2',
            clientName: 'Pierre Martin',
            address: '42 Avenue Foch',
            city: 'Lille',
            phone: '06 98 76 54 32',
            status: 'delivery',
            estimatedTime: 18,
            distance: '4.1 km',
            weight: '3.8 kg',
          }
        );
      }

      setOrders(transformedOrders);
      if (!currentOrder && transformedOrders.length > 0) {
        setCurrentOrder(transformedOrders[0]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNavigating || !currentOrder) return;
    setEta(currentOrder.estimatedTime);
    const id = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(id);
  }, [isNavigating, currentOrder]);

  const openMapsNavigation = () => {
    if (!currentOrder) return;
    const address = encodeURIComponent(`${currentOrder.address}, ${currentOrder.city}`);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS
      ? `maps://maps.apple.com/?daddr=${address}`
      : `https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=driving`;
    window.open(url, '_blank');
    setIsNavigating(true);
  };

  const markAsComplete = () => {
    if (!currentOrder) return;
    const remaining = orders.filter(o => o.id !== currentOrder.id);
    setOrders(remaining);
    setCurrentOrder(remaining[0] || null);
    setIsNavigating(false);
  };

  if (loading) {
    return (
      <div className="bg-[#0a0f1a] min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-500 mx-auto mb-4" size={40} />
          <p className="text-slate-400">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0f1a] min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-xs uppercase tracking-widest font-bold">Navigation GPS</p>
            <p className="text-white font-bold text-lg">
              {currentOrder ? (currentOrder.status === 'pickup' ? 'Collecte' : 'Livraison') : 'Aucune mission'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm font-semibold">En ligne</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Map placeholder */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-white/10" style={{ height: 240 }}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Navigation size={32} className="text-teal-400" />
              </div>
              {isNavigating ? (
                <>
                  <p className="text-white font-bold text-lg">Navigation active</p>
                  <p className="text-teal-400 text-sm mt-1">ETA: {eta || currentOrder?.estimatedTime} min</p>
                </>
              ) : (
                <>
                  <p className="text-white font-bold">Prêt à naviguer</p>
                  <p className="text-slate-400 text-sm mt-1">Appuyez sur "Lancer GPS" ci-dessous</p>
                </>
              )}
            </div>
          </div>
          {currentOrder && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
              <MapPin size={18} className="text-teal-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">{currentOrder.address}</p>
                <p className="text-slate-400 text-xs">{currentOrder.city} &middot; {currentOrder.distance}</p>
              </div>
            </div>
          )}
        </div>

        {/* Current order card */}
        {currentOrder && (
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentOrder.status === 'pickup' ? 'bg-orange-500/20 text-orange-400' : 'bg-teal-500/20 text-teal-400'}`}>
                  {currentOrder.status === 'pickup' ? <Package size={20} /> : <Truck size={20} />}
                </div>
                <div>
                  <p className="text-white font-bold">{currentOrder.clientName}</p>
                  <p className="text-slate-500 text-xs">{currentOrder.id} &middot; {currentOrder.weight}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${currentOrder.status === 'pickup' ? 'bg-orange-500/20 text-orange-400' : 'bg-teal-500/20 text-teal-400'}`}>
                {currentOrder.status === 'pickup' ? 'Collecte' : 'Livraison'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/[0.05] rounded-xl p-3 text-center">
                <Clock size={16} className="text-slate-400 mx-auto mb-1" />
                <p className="text-white font-bold text-sm">{currentOrder.estimatedTime} min</p>
                <p className="text-slate-500 text-[10px]">Estimation</p>
              </div>
              <div className="bg-white/[0.05] rounded-xl p-3 text-center">
                <MapPin size={16} className="text-slate-400 mx-auto mb-1" />
                <p className="text-white font-bold text-sm">{currentOrder.distance}</p>
                <p className="text-slate-500 text-[10px]">Distance</p>
              </div>
              <div className="bg-white/[0.05] rounded-xl p-3 text-center">
                <Package size={16} className="text-slate-400 mx-auto mb-1" />
                <p className="text-white font-bold text-sm">{currentOrder.weight}</p>
                <p className="text-slate-500 text-[10px]">Poids</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a href={`tel:${currentOrder.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/15 transition">
                <Phone size={16} /> Appeler
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/15 transition">
                <MessageCircle size={16} /> Message
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button onClick={openMapsNavigation} disabled={!currentOrder}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all disabled:opacity-30">
            <Navigation size={20} />
            {isNavigating ? 'Continuer la navigation' : 'Lancer le GPS'}
            <ArrowRight size={18} />
          </button>

          {currentOrder && (
            <button onClick={markAsComplete}
              className="w-full py-3 border border-teal-500/30 text-teal-400 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-teal-500/10 transition">
              <CheckCircle size={16} /> Marquer comme {currentOrder.status === 'pickup' ? 'collecté' : 'livré'}
            </button>
          )}
        </div>

        {/* Queue */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">File d'attente ({orders.length})</p>
            <button onClick={fetchOrders} className="text-teal-400 hover:text-teal-300 transition p-1">
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune mission en attente</p>
              </div>
            ) : (
              orders.map((order) => (
                <button key={order.id}
                  onClick={() => { setCurrentOrder(order); setIsNavigating(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left ${
                    currentOrder?.id === order.id
                      ? 'bg-teal-500/10 border-teal-500/30'
                      : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                  }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    order.status === 'pickup' ? 'bg-orange-500/20 text-orange-400' : 'bg-teal-500/20 text-teal-400'
                  }`}>
                    {order.status === 'pickup' ? 'C' : 'L'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{order.clientName}</p>
                    <p className="text-slate-500 text-xs truncate">{order.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-bold">{order.estimatedTime} min</p>
                    <p className="text-slate-500 text-xs">{order.distance}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
