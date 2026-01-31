import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { DollarSign, Package, Clock, MapPin, Check, Star, TrendingUp, Loader2 } from 'lucide-react';
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
  service_type: string;
  total_price: number;
  washer_earnings: number;
  status: string;
  pickup_address: string;
  pickup_date: string;
  client_notes: string;
  created_at: string;
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

  useEffect(() => {
    fetchWasherData();
    const interval = setInterval(fetchWasherData, 30000); // Refresh toutes les 30s
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
        .select('id, status')
        .eq('user_id', user.id)
        .single();

      if (washerError || !washerProfile) {
        toast.error("Profil Washer introuvable");
        return;
      }

      setWasherId(washerProfile.id);
      setWasherStatus(washerProfile.status);

      if (washerProfile.status !== 'approved') {
        setLoading(false);
        return;
      }

      // Missions disponibles
      const { data: available } = await supabase
        .from('washer_orders')
        .select('*')
        .is('washer_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);

      setAvailableMissions(available || []);

      // Mes missions
      const { data: myOrders } = await supabase
        .from('washer_orders')
        .select('*')
        .eq('washer_id', washerProfile.id)
        .order('created_at', { ascending: false});

      if (myOrders) {
        setMyMissions(myOrders);
        
        const earnings = myOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + parseFloat(o.washer_earnings || 0), 0);
        
        const completed = myOrders.filter(o => o.status === 'completed').length;
        const pending = myOrders.filter(o => 
          o.status !== 'completed' && o.status !== 'cancelled'
        ).length;

        // Récupérer les notes
        const { data: ratings } = await supabase
          .from('washer_ratings')
          .select('rating')
          .eq('washer_id', washerProfile.id);

        let avgRating = 0;
        let totalRatings = 0;

        if (ratings && ratings.length > 0) {
          totalRatings = ratings.length;
          avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        }
        
        setStats({
          totalEarnings: earnings,
          completedOrders: completed,
          pendingOrders: pending,
          avgRating: Math.round(avgRating * 10) / 10,
          totalRatings
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const acceptMission = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('washer_orders')
        .update({ 
          washer_id: washerId, 
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .is('washer_id', null); // Empêche 2 Washers de prendre la même mission

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
        .from('washer_orders')
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-12">
        <h1 className="text-3xl font-black mb-8">Mon Dashboard Washer 💰</h1>

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
              <div key={mission.id} className="bg-white rounded-2xl p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <p className="font-bold text-2xl text-teal-600">
                    {mission.washer_earnings?.toFixed(2)} €
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    mission.service_type === 'express' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {mission.service_type === 'express' ? '⚡ Express' : 'Standard'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                  <MapPin size={14} />
                  {mission.pickup_address}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {mission.weight} kg • {new Date(mission.pickup_date).toLocaleDateString('fr-FR')}
                </p>
                <button
                  onClick={() => acceptMission(mission.id)}
                  className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 flex items-center justify-center gap-2"
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
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div>
            {myMissions
              .filter(m => m.status !== 'completed' && m.status !== 'cancelled')
              .map(mission => (
                <div key={mission.id} className="bg-white rounded-2xl p-6 mb-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-xl mb-2">{mission.washer_earnings?.toFixed(2)} €</p>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mb-2">
                        <MapPin size={14} />
                        {mission.pickup_address}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        mission.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        mission.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {mission.status === 'assigned' && 'Assigné'}
                        {mission.status === 'in_progress' && 'En cours'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {mission.status === 'assigned' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'in_progress')}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500"
                        >
                          ▶ Commencer
                        </button>
                      )}
                      {mission.status === 'in_progress' && (
                        <button
                          onClick={() => updateMissionStatus(mission.id, 'completed')}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                        >
                          ✅ Terminer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {myMissions.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length === 0 && (
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
                    <p className="font-bold text-green-600">+{mission.washer_earnings?.toFixed(2)} €</p>
                    <p className="text-sm text-slate-500">
                      {new Date(mission.completed_at || mission.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                    Terminé
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
