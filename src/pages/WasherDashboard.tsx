import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { DollarSign, Package, Clock, MapPin, Check, Star, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface WasherStats {
  totalEarnings: number;
  completedOrders: number;
  pendingOrders: number;
  avgRating: number;
  totalRatings: number;
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
    totalRatings: 0
  });
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [myMissions, setMyMissions] = useState<Mission[]>([]);
  const [washerId, setWasherId] = useState<string | null>(null);
  const [washerStatus, setWasherStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    fetchWasherData();
    const interval = setInterval(fetchWasherData, 30000);
    return () => clearInterval(interval);
  }, []);

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
        .select('id, status, is_available')
        .eq('user_id', user.id)
        .single();

      if (washerError || !washerProfile) {
        toast.error("Profil Washer introuvable");
        return;
      }

      setWasherId(washerProfile.id);
      setWasherStatus(washerProfile.status);
      setIsAvailable(washerProfile.is_available ?? true);

      if (washerProfile.status !== 'approved') {
        setLoading(false);
        return;
      }

      // ✅ MISSIONS DISPONIBLES (commandes sans washer_id et status=confirmed)
      const { data: available } = await supabase
        .from('orders')
        .select('*')
        .is('washer_id', null)
        .is('partner_id', null)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(20);

      setAvailableMissions(available || []);

      // ✅ MES MISSIONS (commandes assignées à moi)
      const { data: myOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('washer_id', washerProfile.id)
        .order('created_at', { ascending: false });

      if (myOrders) {
        setMyMissions(myOrders);
        
        // Commission Washer : 60% du prix (3€ standard = 1.80€, 5€ express = 3€)
        const earnings = myOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => {
            const commission = o.formula === 'express' ? 0.6 : 0.6; // 60% dans les deux cas
            return sum + (parseFloat(o.total_price) * commission);
          }, 0);
        
        const completed = myOrders.filter(o => o.status === 'completed').length;
        const pending = myOrders.filter(o => 
          o.status === 'assigned' || o.status === 'in_progress'
        ).length;

        setStats({
          totalEarnings: earnings,
          completedOrders: completed,
          pendingOrders: pending,
          avgRating: 0, // TODO: Implémenter système de notes
          totalRatings: 0
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
      toast.error("Mission déjà prise");
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

      toast.success("Statut mis à jour !");
      fetchWasherData();
    } catch (error) {
      toast.error("Erreur");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Chargement...</p>
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
            <p className="text-slate-600">Ton dossier est en cours de vérification. On te contacte sous 24h.</p>
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
            <h1 className="text-3xl font-black mb-4">Inscription non validée</h1>
            <p className="text-slate-600">Contacte-nous pour plus d'informations.</p>
          </div>
        </div>
      </div>
    );
  }

  const calculateEarnings = (mission: Mission) => {
    const commission = 0.6; // 60% pour le Washer
    return (parseFloat(String(mission.total_price)) * commission).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Mon Dashboard Washer 💰</h1>
          
          {/* Toggle Disponibilité */}
          <button
            onClick={toggleAvailability}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition ${
              isAvailable 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-white' : 'bg-slate-500'}`}></div>
            {isAvailable ? 'Disponible' : 'Indisponible'}
          </button>
        </div>

        {!isAvailable && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-orange-600" size={20} />
            <p className="text-orange-800 font-medium">
              Vous êtes indisponible. Activez votre disponibilité pour recevoir des missions.
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <DollarSign className="text-green-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">Gains totaux</p>
            <p className="text-3xl font-black">{stats.totalEarnings.toFixed(2)} €</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <Package className="text-blue-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">Missions terminées</p>
            <p className="text-3xl font-black">{stats.completedOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <Clock className="text-orange-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">En cours</p>
            <p className="text-3xl font-black">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <Star className="text-yellow-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-bold">Note moyenne</p>
            <p className="text-3xl font-black">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-3 px-4 font-bold ${
              activeTab === 'available' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'
            }`}
          >
            Missions disponibles ({availableMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-4 font-bold ${
              activeTab === 'active' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'
            }`}
          >
            Mes missions ({stats.pendingOrders})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-bold ${
              activeTab === 'history' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-400'
            }`}
          >
            Historique
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === 'available' && (
          <div className="grid md:grid-cols-3 gap-6">
            {availableMissions.map(mission => (
              <div key={mission.id} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <p className="font-bold text-2xl text-teal-600">
                    {calculateEarnings(mission)} €
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    mission.formula === 'express' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {mission.formula === 'express' ? '⚡ Express' : '🟢 Standard'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                  <MapPin size={14} />
                  {mission.pickup_address?.split(' (')[0] || 'Adresse non définie'}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {mission.weight} kg • {new Date(mission.pickup_date).toLocaleDateString('fr-FR')}
                </p>
                <button
                  onClick={() => acceptMission(mission.id)}
                  disabled={!isAvailable}
                  className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Check size={20} />
                  Accepter
                </button>
              </div>
            ))}
            {availableMissions.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-2xl">
                <Package size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400">Aucune mission disponible</p>
                <p className="text-sm text-slate-400 mt-2">Les nouvelles commandes apparaîtront ici</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div>
            {myMissions
              .filter(m => m.status === 'assigned' || m.status === 'in_progress')
              .map(mission => (
                <div key={mission.id} className="bg-white rounded-2xl p-6 mb-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-xl mb-2 text-teal-600">{calculateEarnings(mission)} €</p>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mb-2">
                        <MapPin size={14} />
                        {mission.pickup_address?.split(' (')[0]}
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        {mission.weight} kg • {mission.formula === 'express' ? '⚡ Express' : '🟢 Standard'}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        mission.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        mission.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {mission.status === 'assigned' && '📦 Assigné'}
                        {mission.status === 'in_progress' && '🔄 En cours'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {mission.status === 'assigned' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'in_progress')}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 whitespace-nowrap"
                        >
                          ▶ Commencer
                        </button>
                      )}
                      {mission.status === 'in_progress' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'completed')}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 whitespace-nowrap"
                        >
                          ✅ Terminer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {myMissions.filter(m => m.status === 'assigned' || m.status === 'in_progress').length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl">
                <Clock size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400">Aucune mission active</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {myMissions
              .filter(m => m.status === 'completed')
              .map(mission => (
                <div key={mission.id} className="bg-white rounded-2xl p-6 mb-4 border flex justify-between items-center">
                  <div>
                    <p className="font-bold text-green-600">+{calculateEarnings(mission)} €</p>
                    <p className="text-sm text-slate-500">
                      {new Date(mission.completed_at || mission.created_at).toLocaleDateString('fr-FR')} • {mission.weight}kg
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                    ✅ Terminé
                  </span>
                </div>
              ))}
            {myMissions.filter(m => m.status === 'completed').length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl">
                <TrendingUp size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400">Pas encore d'historique</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
