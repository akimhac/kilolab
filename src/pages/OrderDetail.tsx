import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database';
import { ArrowLeft, Package, MapPin, Calendar, Clock } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          partner:partners(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Commande introuvable</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'ready': return 'Prêt';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getServiceText = (type: string) => {
    switch (type) {
      case 'standard': return 'Premium (72-96h)';
      case 'express': return 'Express (24h)';
      case 'ultra': return 'Ultra Express (6h)';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au dashboard
        </button>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Détail de la commande</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Package className="w-5 h-5" />
                  <span>Service</span>
                </div>
                <p className="text-white text-lg font-semibold">{getServiceText(order.service_type)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span>Point relais</span>
                </div>
                <p className="text-white text-lg font-semibold">{order.partner?.name}</p>
                <p className="text-gray-400 text-sm">{order.partner?.address}, {order.partner?.city}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span>Date</span>
                </div>
                <p className="text-white text-lg">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-2">Poids</p>
                <p className="text-white text-2xl font-bold">{order.weight} kg</p>
              </div>

              <div>
                <p className="text-gray-400 mb-2">Prix total</p>
                <p className="text-white text-4xl font-bold">{order.total_price}€</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-gray-400 mb-2">Notes</p>
                  <p className="text-white">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photos Upload */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Photos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Photo avant</h3>
                <PhotoUpload orderId={order.id} photoType="before" onUploadComplete={fetchOrder} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Photo après</h3>
                <PhotoUpload orderId={order.id} photoType="after" onUploadComplete={fetchOrder} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}