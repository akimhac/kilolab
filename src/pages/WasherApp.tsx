import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { DollarSign, Package, Clock, MapPin, Check, X, Phone, Navigation, TrendingUp, Star, AlertCircle } from 'lucide-react';
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
  total_price: number;
  washer_earnings: number;
  status: string;
  pickup_address: string;
  pickup_date: string;
  client_notes: string;
  created_at: string;
  completed_at: string | null;
}

export default function WasherApp() {
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
    
    // Rafraîchir toutes les 30 secondes
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
        .select('id, status')
        .eq('user_id', user.id)
        .single();

      if (washerError || !washerProfile) {
        toast.error("Profil Washer introuvable. Inscris-toi d'abord !");
        return;
      }

      setWasherId(washerProfile.id);
      setWasherStatus(washerProfile.status);

      // Si le Washer n'est pas approuvé, on ne charge rien d'autre
      if (washerProfile.status !== 'approved') {
        setLoading(false);
        return;
      }

      // Missions disponibles (sans Washer assigné, dans la même ville)
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
        .order('created_at', { ascending: false });

      if (myOrders) {
        setMyMissions(myOrders);
        
        // Calculer les stats
        const earnings = myOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + parseFloat(o.washer_earnings || 0), 0);
        
        const completed = myOrders.filter(o => o.status === 'completed').length;
        const pending = myOrders.filter(o => 
          o.status !== 'completed' && o.status !== 'cancelled'
        ).length;

        // Récupérer la note moyenne
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
      toast.error('Erreur lors du chargement des données');
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
        .from('washer_orders')
        .update(updates)
        .eq('id', orderId)
        .eq('washer_id', washerId);

      if (error) throw error;

      toast.success("Statut mis à jour !");
      fetchWasherData();
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Chargement de ton dashboard...</p>
        </div>
      </div>
    );
  }

  // Écran d'attente validation
  if (washerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p​​​​​​​​​​​​​​​​
