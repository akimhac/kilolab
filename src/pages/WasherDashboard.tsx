import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { requestNotificationPermission } from '../lib/firebase';
import Navbar from '../components/Navbar';
import { 
  DollarSign, Package, Clock, MapPin, Check, Star, TrendingUp, 
  Loader2, AlertCircle, Bell, Euro, Calendar, User, ArrowRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface WasherStats {
  totalEarnings: number;
  completedOrders: number;
  pendingOrders: number;
  avgRating: number;
  totalRatings: number;
  weekEarnings: number;
}

interface Mission {
  id: string;
  client_id: string;
  weight: number;
  formula: string;
  total_price: number;
  status: string;
  pickup_address: string;
  pickup_date: string;
  pickup_slot: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  created_at: string;
  assigned_at: string | null;
  completed_at: string | null;
}

export default function WasherDashboard() {
  const [stats, setStats] = useState<WasherStats>({ 
    totalEarnings: 0, 
    completedOrders: 0, 
    pendingOrders: 0,
    avgRating: 0,
    totalRatings: 0,
    weekEarnings: 0
  });
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [myMissions, setMyMissions] = useState<Mission[]>([]);
  const [washerId, setWasherId] = useState<string | null>(null);
  const [washerStatus, setWasherStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [isAvailable, setIsAvailable] = useState(true);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // ✅ Stripe Connect
  const [stripeConnectStatus, setStripeConnectStatus] = useState<{
    completed: boolean;
    onboardingUrl?: string;
  }>({ completed: false });

  useEffect(() => {
    fetchWasherData();
    const interval = setInterval(fetchWasherData, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, []);

  // ✅ Notifications Push
  useEffect(() => {
    const setupNotifications = async () => {
      console.log('🔔 Configuration des notifications...');
      
      const token = await requestNotificationPermission();
      
      if (token && washerId) {
        setFcmToken(token);
        setNotificationsEnabled(true);
        
        const { error } = await supabase
          .from('washers')
          .update({ fcm_token: token })
          .eq('id', washerId);
        
        if (error) {
          console.error('❌ Erreur sauvegarde token:', error);
        } else {
          console.log('✅ Token FCM sauvegardé');
          toast.success('🔔 Notifications activées !', { duration: 2000 });
        }
      }
    };
    
    if (washerStatus === 'approved' && washerId && !fcmToken) {
      setupNotifications();
    }
  }, [washerId, washerStatus, fcmToken]);

  // ✅ Vérifier Stripe Connect
  useEffect(() => {
    const checkStripeConnect = async () => {
      if (!washerId || washerStatus !== 'approved') return;

      try {
        const { data, error } = await supabase.functions.invoke('check-stripe-connect-status', {
          body: { washerId }
        });

        if (error) throw error;

        setStripeConnectStatus({
          completed: data.completed || false
        });

      } catch (error) {
        console.error('Erreur vérification Stripe:', error);
      }
    };

    checkStripeConnect();
  }, [washerId, washerStatus]);

  const fetchWasherData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Non authentifié");
        return;
      }

      // Récupérer le profil Washer
      const { data: washerProfile, error: washerError } = await supabase
        .from('washers')
        .select('id, status, is_available, fcm_token')
        .eq('user_id', user.id)
        .single();

      if (washerError || !washerProfile) {
        toast.error("Profil Washer introuvable");
        return;
      }

      setWasherId(washerProfile.id);
      setWasherStatus(washerProfile.status);
      setIsAvailable(washerProfile.is_available ?? true);
      
      if (washerProfile.fcm_token) {
        setFcmToken(washerProfile.fcm_token);
        setNotificationsEnabled(true);
      }

      if (washerProfile.status !== 'approved') {
        setLoading(false);
        return;
      }

      // ✅ MISSIONS DISPONIBLES
      const { data: available } = await supabase
        .from('orders')
        .select('*')
        .is('washer_id', null)
        .is('partner_id', null)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(20);

      setAvailableMissions(available || []);

      // ✅ MES MISSIONS
      const { data: myOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('washer_id', washerProfile.id)
        .order('created_at', { ascending: false });

      if (myOrders) {
        setMyMissions(myOrders);
        
        // Commission Washer : 60%
        const totalEarnings = myOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (parseFloat(o.total_price) * 0.6), 0);
        
        // Gains de la semaine
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const weekEarnings = myOrders
          .filter(o => o.status === 'completed' && new Date(o.completed_at) >= startOfWeek)
          .reduce((sum, o) => sum + (parseFloat(o.total_price) * 0.6), 0);
        
        const completed = myOrders.filter(o => o.status === 'completed').length;
        const pending = myOrders.filter(o => 
          o.status === 'assigned' || o.status === 'in_progress'
        ).length;

        setStats({
          totalEarnings,
          completedOrders: completed,
          pendingOrders: pending,
          avgRating: 0,
          totalRatings: 0,
          weekEarnings
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const { error } = await supabase
        .from('washers')
        .update({ is_available: !isAvailable })
        .eq('id', washerId);

      if (error) throw error;

      setIsAvailable(!isAvailable);
      toast.success(isAvailable ? "Vous êtes maintenant indisponible" : "Vous êtes maintenant disponible");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const acceptMission = async (orderId: string) => {
    if (!isAvailable) {
      toast.error("Activez votre disponibilité d'abord");
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          washer_id: washerId, 
          status: 'assigned',
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .is('washer_id', null);

      if (error) throw error;

      toast.success("Mission acceptée ! 🎉");
      fetchWasherData();
    } catch (error) {
      toast.error("Mission déjà prise ou erreur");
    }
  };

  const updateMissionStatus = async (orderId: string, newStatus: string) => {
    try {
      const updates: any = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      };
      
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .eq('washer_id', washerId);

      if (error) throw error;

      toast.success(newStatus === 'completed' ? "Mission terminée ! 🎉" : "Statut mis à jour !");
      fetchWasherData();
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  // ✅ Créer compte Stripe Connect
  const handleStripeConnect = async () => {
    try {
      toast.loading("Création de votre compte de paiement...", { id: 'stripe' });

      const { data: washerData } = await supabase
        .from('washers')
        .select('full_name, email')
        .eq('id', washerId)
        .single();

      const names = washerData.full_name.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || names[0];

      const { data, error } = await supabase.functions.invoke('create-stripe-connect-account', {
        body: { 
          washerId,
          email: washerData.email,
          firstName,
          lastName
        }
      });

      if (error) throw error;

      toast.dismiss('stripe');

      if (data.onboardingUrl) {
        toast.success("Redirection vers Stripe...");
        window.location.href = data.onboardingUrl;
      } else {
        setStripeConnectStatus({ completed: data.onboardingCompleted });
        toast.success("Compte déjà configuré !");
      }

    } catch (error: any) {
      toast.dismiss('stripe');
      toast.error("Erreur : " + error.message);
    }
  };

  const calculateEarnings = (mission: Mission) => {
    const commission = 0.6;
    return (parseFloat(String(mission.total_price)) * commission).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  if (washerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <Clock className="text-orange-600 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-black mb-4">Validation en cours ⏳</h1>
            <p className="text-slate-600 mb-6">
              Votre dossier est en cours de vérification par notre équipe. 
              Nous vous contacterons sous 24h.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                <strong>En attendant :</strong> Procurez-vous un peson digital (~10€) et de la lessive hypoallergénique.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (washerStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <AlertCircle className="text-red-600 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-black mb-4">Inscription non validée</h1>
            <p className="text-slate-600 mb-6">
              Votre candidature n'a pas pu être acceptée. 
            </p>
            <p className="text-sm text-slate-500">
              Contactez-nous à <a href="mailto:support@kilolab.fr" className="text-teal-600 font-bold">support@kilolab.fr</a> pour plus d'informations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2">Mon Dashboard Washer</h1>
            <p className="text-slate-600">Gérez vos missions et vos revenus</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Statut Notifications */}
            {notificationsEnabled ? (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <Bell size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">Notifs ON</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
                <Bell size={16} className="text-orange-600" />
                <span className="text-sm font-bold text-orange-700">Notifs OFF</span>
              </div>
            )}
            
            {/* Toggle Disponibilité */}
            <button
              onClick={toggleAvailability}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 ${
                isAvailable 
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg' 
                  : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
              }`}
            >
              <div className={`w-3 h-3 rounded-full animate-pulse ${isAvailable ? 'bg-white' : 'bg-slate-500'}`}></div>
              {isAvailable ? 'Disponible' : 'Indisponible'}
            </button>
          </div>
        </div>

        {/* ALERTES */}
        {!isAvailable && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-orange-600 shrink-0" size={20} />
            <p className="text-orange-800 font-medium">
              Vous êtes indisponible. Activez votre disponibilité pour recevoir des missions.
            </p>
          </div>
        )}

        {!notificationsEnabled && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-blue-600 shrink-0" size={20} />
            <p className="text-blue-800 font-medium">
              Les notifications sont désactivées. Rechargez la page et autorisez les notifications pour être alerté des nouvelles missions.
            </p>
          </div>
        )}

        {/* ✅ ALERTE STRIPE CONNECT */}
        {!stripeConnectStatus.completed && (
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Euro size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                  Configurez vos virements automatiques
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Requis</span>
                </h3>
                <p className="text-blue-700 mb-4">
                  Connectez votre compte bancaire pour recevoir vos paiements automatiquement chaque dimanche soir.
                </p>
                <button
                  onClick={handleStripeConnect}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
                >
                  Configurer mes paiements <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition">
            <DollarSign className="text-green-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">Gains totaux</p>
            <p className="text-3xl font-black text-green-600">{stats.totalEarnings.toFixed(2)} €</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition">
            <TrendingUp className="text-teal-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">Cette semaine</p>
            <p className="text-3xl font-black text-teal-600">{stats.weekEarnings.toFixed(2)} €</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition">
            <Package className="text-blue-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">Missions terminées</p>
            <p className="text-3xl font-black text-blue-600">{stats.completedOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition">
            <Clock className="text-orange-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">En cours</p>
            <p className="text-3xl font-black text-orange-600">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-3 px-4 font-bold whitespace-nowrap transition ${
              activeTab === 'available' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            📦 Disponibles ({availableMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-4 font-bold whitespace-nowrap transition ${
              activeTab === 'active' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            🔄 Mes missions ({stats.pendingOrders})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-bold whitespace-nowrap transition ${
              activeTab === 'history' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            ✅ Historique ({stats.completedOrders})
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === 'available' && (
          <div className="grid md:grid-cols-3 gap-6">
            {availableMissions.map(mission => (
              <div key={mission.id} className="bg-white rounded-2xl p-6 border hover:shadow-xl transition-all transform hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Vous gagnez</p>
                    <p className="font-bold text-3xl text-teal-600">
                      {calculateEarnings(mission)}€
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    mission.formula === 'express' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {mission.formula === 'express' ? '⚡ Express' : '🟢 Standard'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{mission.pickup_address?.split(' (')[0] || 'Adresse non définie'}</span>
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Package size={14} className="shrink-0" />
                    {mission.weight} kg
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Calendar size={14} className="shrink-0" />
                    {new Date(mission.pickup_date).toLocaleDateString('fr-FR')}
                  </p>
                  {mission.pickup_slot && (
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Clock size={14} className="shrink-0" />
                      {mission.pickup_slot}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => acceptMission(mission.id)}
                  disabled={!isAvailable}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold hover:from-teal-500 hover:to-teal-400 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <Check size={20} />
                  Accepter la mission
                </button>
              </div>
            ))}
            {availableMissions.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-white rounded-2xl border">
                <Package size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400 text-lg mb-2">Aucune mission disponible pour le moment</p>
                <p className="text-sm text-slate-400">Les nouvelles commandes apparaîtront ici automatiquement</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {myMissions
              .filter(m => m.status === 'assigned' || m.status === 'in_progress')
              .map(mission => (
                <div key={mission.id} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <p className="font-bold text-2xl text-teal-600">{calculateEarnings(mission)}€</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          mission.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {mission.status === 'assigned' ? '📦 Nouvelle mission' : '🔄 En cours'}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <MapPin size={14} />
                          {mission.pickup_address?.split(' (')[0]}
                        </p>
                        <p className="flex items-center gap-2">
                          <Package size={14} />
                          {mission.weight} kg • {mission.formula === 'express' ? '⚡ Express' : '🟢 Standard'}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(mission.pickup_date).toLocaleDateString('fr-FR')}
                        </p>
                        {mission.pickup_slot && (
                          <p className="flex items-center gap-2">
                            <Clock size={14} />
                            {mission.pickup_slot}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      {mission.status === 'assigned' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'in_progress')}
                          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 whitespace-nowrap transition"
                        >
                          ▶️ Commencer la mission
                        </button>
                      )}
                      {mission.status === 'in_progress' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'completed')}
                          className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 whitespace-nowrap transition"
                        >
                          ✅ Marquer comme terminée
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {myMissions.filter(m => m.status === 'assigned' || m.status === 'in_progress').length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <Clock size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400 text-lg mb-2">Aucune mission active</p>
                <p className="text-sm text-slate-400">Acceptez des missions depuis l'onglet "Disponibles"</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {myMissions
              .filter(m => m.status === 'completed')
              .map(mission => (
                <div key={mission.id} className="bg-white rounded-2xl p-6 border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-xl text-green-600">+{calculateEarnings(mission)}€</p>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                        ✅ Payé dimanche
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(mission.completed_at || mission.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="flex items-center gap-2">
                        <Package size={14} />
                        {mission.weight}kg
                      </p>
                      <p className="flex items-center gap-2">
                        {mission.formula === 'express' ? '⚡' : '🟢'} {mission.formula === 'express' ? 'Express' : 'Standard'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            {myMissions.filter(m => m.status === 'completed').length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <TrendingUp size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400 text-lg mb-2">Pas encore d'historique</p>
                <p className="text-sm text-slate-400">Vos missions terminées apparaîtront ici</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
