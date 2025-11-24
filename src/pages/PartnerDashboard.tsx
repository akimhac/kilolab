import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowLeft, Gift, Euro } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import { promoService } from '../services/promoService';

interface Order {
  id: string;
  user_id: string;
  weight_kg: number;
  service_type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPromo, setHasPromo] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    loadPartnerData(session.user.id);
  };

  const loadPartnerData = async (userId: string) => {
    try {
      // Récupérer infos pressing
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (partnerError) throw partnerError;
      setPartner(partnerData);

      // Récupérer commandes
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Vérifier promo active
      const promo = await promoService.getPartnerPromo(partnerData.id);
      if (promo) {
        setHasPromo(true);
        setPromoData(promo);
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) throw error;

    toast.success('Statut mis à jour');
    
    // Recharger les commandes
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  } catch (error: any) {
    console.error('Erreur:', error);
    toast.error('Erreur de mise à jour');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pressing pas encore activé
  if (partner && !partner.is_active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              Compte en cours de validation
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Merci pour votre inscription ! Notre équipe vérifie actuellement vos informations. 
              Vous recevrez un email de confirmation dès que votre compte sera activé.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-slate-900 mb-3">Pendant ce temps :</h3>
              <ul className="text-left space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Votre compte bénéficiera du <strong>1er mois gratuit</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Vous apparaîtrez sur notre carte dès activation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Validation sous <strong>24-48h ouvrées</strong></span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Questions ? Contactez-nous à{' '}
              <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline font-semibold">
                contact@kilolab.fr
              </a>
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
            className="text-slate-600 hover:text-slate-900 transition font-semibold"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Dashboard Partenaire
          </h1>
          <p className="text-slate-600">
            Bienvenue {partner?.name}
          </p>
        </div>

        {/* Badge Promo */}
        {hasPromo && promoData && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="w-7 h-7" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xl md:text-2xl font-black mb-1">
                  🎉 Offre de lancement active !
                </p>
                <p className="text-green-100">
                  <strong className="text-white">0€ de commission</strong> pendant encore{' '}
                  <strong className="text-white text-lg">
                    {promoService.getDaysRemaining(promoData.end_date)} jours
                  </strong>
                </p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-green-100 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Expire le</span>
                </div>
                <p className="text-lg font-bold">
                  {new Date(promoData.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Commandes totales</p>
                <p className="text-3xl font-black text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">En attente</p>
                <p className="text-3xl font-black text-slate-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Terminées</p>
                <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Chiffre d'affaires</p>
                <p className="text-3xl font-black text-slate-900">{stats.revenue.toFixed(0)}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Commandes</h2>

          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Aucune commande"
              description="Vous n'avez pas encore reçu de commande. Elles apparaîtront ici."
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-slate-900">
                        {order.weight_kg} kg • {order.service_type === 'express' ? 'Express 24h' : 'Standard 48-72h'}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">
                        {order.total_amount.toFixed(2)}€
                      </p>
                      {hasPromo && order.status !== 'completed' && (
                        <p className="text-xs text-green-600 font-semibold">
                          0€ commission (promo active)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'in_progress')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Accepter
                      </button>
                    )}
                    {order.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Marquer comme prêt
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                      >
                        Terminer
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        Terminé
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
