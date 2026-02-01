import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { 
  ArrowLeft, Package, Clock, CheckCircle, MapPin, 
  Phone, QrCode, Share2, Download, Copy, RefreshCw,
  AlertCircle, Star, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  user_id: string;
  washer_id: string | null;
  partner_id: string | null;
  weight: number;
  formula: string;
  total_price: number;
  status: string;
  pickup_address: string;
  pickup_date: string;
  pickup_slot: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [washer, setWasher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeType, setDisputeType] = useState('quality');
  const [disputeDescription, setDisputeDescription] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
      const interval = setInterval(loadOrderDetails, 30000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(orderData);

      if (orderData.washer_id) {
        const { data: washerData } = await supabase
          .from('washers')
          .select('*')
          .eq('id', orderData.washer_id)
          .single();
        setWasher(washerData);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Commande introuvable');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!disputeDescription.trim()) {
      toast.error('Veuillez décrire le problème');
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('create-dispute', {
        body: {
          orderId: order?.id,
          type: disputeType,
          description: disputeDescription
        }
      });

      if (error) throw error;

      toast.success('Litige enregistré. Nous vous contacterons sous 24h.');
      setShowDisputeForm(false);
      setDisputeDescription('');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `KILOLAB:${orderId}`
  )}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Commande introuvable</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'En attente', color: 'orange', icon: Clock },
    confirmed: { label: 'Confirmée', color: 'blue', icon: CheckCircle },
    assigned: { label: 'Assignée à un Washer', color: 'purple', icon: Package },
    in_progress: { label: 'En cours de lavage', color: 'indigo', icon: RefreshCw },
    completed: { label: 'Terminée', color: 'green', icon: CheckCircle }
  };

  const currentStatus = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-3xl mx-auto pb-12">
        <button
          onClick={() => navigate('/client-dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold mb-6"
        >
          <ArrowLeft size={20} />
          Retour au dashboard
        </button>

        <div className="text-center mb-8">
          <p className="text-sm text-slate-500 mb-1">Commande</p>
          <h1 className="text-3xl font-black">#{order.id.slice(0, 8).toUpperCase()}</h1>
        </div>

        {/* Statut actuel */}
        <div className={`bg-gradient-to-r ${
          currentStatus.color === 'green' ? 'from-green-500 to-emerald-600' :
          currentStatus.color === 'orange' ? 'from-orange-500 to-yellow-500' :
          currentStatus.color === 'blue' ? 'from-blue-500 to-cyan-500' :
          currentStatus.color === 'purple' ? 'from-purple-500 to-pink-500' :
          'from-indigo-500 to-purple-500'
        } rounded-3xl p-8 text-white mb-6 shadow-2xl`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <currentStatus.icon size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black">{currentStatus.label}</h2>
              <p className="text-white/80">
                {new Date(order.updated_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {washer && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-white/70 mb-1">Votre Washer</p>
              <p className="font-bold text-lg">{washer.full_name}</p>
              <p className="text-sm text-white/80">{washer.city}</p>
            </div>
          )}
        </div>

        {/* QR Code */}
        {order.status === 'completed' && (
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <QrCode className="text-teal-600" size={24} />
              QR Code de retrait
            </h3>
            <div className="inline-block bg-white p-4 rounded-2xl border-4 border-teal-100">
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="text-slate-600 mt-4">Présentez ce code pour récupérer votre linge</p>
          </div>
        )}

        {/* Détails */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6">Détails de la commande</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Formule</span>
              <span className="font-bold">
                {order.formula === 'express' ? '⚡ Express' : '📦 Standard'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Poids</span>
              <span className="font-bold">{order.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Adresse de collecte</span>
              <span className="font-bold text-right">{order.pickup_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Date de collecte</span>
              <span className="font-bold">
                {new Date(order.pickup_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <span className="text-xl font-black">Total</span>
              <span className="text-xl font-black text-teal-600">{order.total_price} €</span>
            </div>
          </div>
        </div>

        {/* Signaler un problème */}
        {order.status === 'completed' && !showDisputeForm && (
          <button
            onClick={() => setShowDisputeForm(true)}
            className="w-full py-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl font-bold hover:bg-red-100 flex items-center justify-center gap-2 mb-6"
          >
            <AlertCircle size={20} />
            Signaler un problème
          </button>
        )}

        {/* Formulaire litige */}
        {showDisputeForm && (
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg border-2 border-red-200">
            <h3 className="text-xl font-bold mb-4 text-red-700">Signaler un problème</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Type de problème</label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value)}
                  className="w-full p-3 border-2 rounded-xl"
                >
                  <option value="quality">Qualité du lavage</option>
                  <option value="lost">Linge perdu</option>
                  <option value="damage">Linge endommagé</option>
                  <option value="delay">Retard</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description détaillée</label>
                <textarea
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Expliquez le problème en détail..."
                  rows={4}
                  className="w-full p-3 border-2 rounded-xl"
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-orange-800">
                  ⏰ Si aucune réponse sous 48h, un remboursement automatique sera effectué.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisputeForm(false)}
                  className="flex-1 py-3 bg-slate-100 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitDispute}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
