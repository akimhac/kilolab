import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Clock, CheckCircle, Award, BookOpen, Play, Users, 
  MapPin, Bell, Gift, Share2, ChevronRight, Loader2,
  Star, Shield, Zap, TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface WasherData {
  id: string;
  full_name: string;
  email: string;
  city: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  queue_position?: number;
}

export default function WasherWaitlist() {
  const [washerData, setWasherData] = useState<WasherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [totalWashersInQueue, setTotalWashersInQueue] = useState(0);
  const [clientsInZone, setClientsInZone] = useState(0);

  // Training modules
  const trainingModules = [
    {
      id: 'intro',
      title: 'Bienvenue chez Kilolab',
      duration: '5 min',
      description: 'Découvrez notre mission et comment nous révolutionnons la laverie',
      icon: BookOpen,
    },
    {
      id: 'process',
      title: 'Le processus de lavage',
      duration: '10 min',
      description: 'Standards de qualité, tri du linge, températures recommandées',
      icon: Zap,
    },
    {
      id: 'app',
      title: 'Utiliser l\'application Washer',
      duration: '8 min',
      description: 'Accepter les missions, scanner les QR codes, déclarer les livraisons',
      icon: Play,
    },
    {
      id: 'quality',
      title: 'Garantir la satisfaction client',
      duration: '7 min',
      description: 'Communication, pliage soigné, gestion des réclamations',
      icon: Star,
    },
    {
      id: 'legal',
      title: 'Aspects légaux et assurance',
      duration: '6 min',
      description: 'Statut auto-entrepreneur, assurance, responsabilités',
      icon: Shield,
    },
  ];

  useEffect(() => {
    checkWasherStatus();
    loadStats();
    // Load completed modules from localStorage
    const saved = localStorage.getItem('kilolab_training_completed');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

  const checkWasherStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: washer } = await supabase
        .from('washers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (washer) {
        // Calculate queue position
        const { count } = await supabase
          .from('washers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .lt('created_at', washer.created_at);
        
        setWasherData({
          ...washer,
          queue_position: (count || 0) + 1
        });

        // Get referral count
        const { count: refCount } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', user.id);
        
        setReferralCount(refCount || 0);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Total washers in queue
      const { count: queueCount } = await supabase
        .from('washers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      setTotalWashersInQueue(queueCount || 47);

      // Simulated clients in zone (would be real data in production)
      setClientsInZone(Math.floor(Math.random() * 30) + 15);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const completeModule = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      setCompletedModules(updated);
      localStorage.setItem('kilolab_training_completed', JSON.stringify(updated));
      toast.success('Module terminé ! 🎉');
    }
  };

  const copyReferralLink = () => {
    const link = `https://kilolab.fr/signup?ref=${washerData?.id || 'washer'}`;
    navigator.clipboard.writeText(link);
    toast.success('Lien de parrainage copié !');
  };

  const progressPercent = (completedModules.length / trainingModules.length) * 100;
  const isCertified = completedModules.length === trainingModules.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Espace Washer - Kilolab</title>
      </Helmet>
      <Navbar />

      <div className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-4">
            <Clock size={16} />
            Espace Pré-lancement
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Bienvenue, futur <span className="text-teal-400">Washer</span> !
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Préparez-vous au lancement en suivant notre formation et en parrainant vos premiers clients.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-teal-400 mb-1">
              #{washerData?.queue_position || '?'}
            </div>
            <p className="text-slate-400 text-sm">Votre position</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-purple-400 mb-1">{totalWashersInQueue}</div>
            <p className="text-slate-400 text-sm">Washers en attente</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-1">{clientsInZone}</div>
            <p className="text-slate-400 text-sm">Clients dans votre zone</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-orange-400 mb-1">{referralCount}</div>
            <p className="text-slate-400 text-sm">Vos parrainages</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Training */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Progress */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="text-teal-400" />
                  Formation Washer
                </h2>
                {isCertified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                    <Award size={16} />
                    Certifié
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progression</span>
                  <span className="text-teal-400 font-bold">{completedModules.length}/{trainingModules.length} modules</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Modules List */}
              <div className="space-y-3">
                {trainingModules.map((module, idx) => {
                  const isCompleted = completedModules.includes(module.id);
                  const Icon = module.icon;
                  
                  return (
                    <div 
                      key={module.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                        isCompleted 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-slate-700/50 border-slate-600 hover:border-teal-500/50'
                      }`}
                      onClick={() => completeModule(module.id)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="text-white" size={24} />
                        ) : (
                          <Icon className="text-slate-300" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Module {idx + 1}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{module.duration}</span>
                        </div>
                        <h3 className="font-bold text-white">{module.title}</h3>
                        <p className="text-sm text-slate-400">{module.description}</p>
                      </div>
                      <ChevronRight className="text-slate-500" size={20} />
                    </div>
                  );
                })}
              </div>

              {isCertified && (
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-center">
                  <Award className="mx-auto text-emerald-400 mb-2" size={32} />
                  <p className="font-bold text-emerald-300">Félicitations ! Vous êtes certifié Washer Kilolab 🎉</p>
                  <p className="text-sm text-emerald-400/70 mt-1">Vous serez activé en priorité dès le lancement dans votre zone.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Referral & Info */}
          <div className="space-y-6">
            {/* Referral Card */}
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Gift className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Parrainez des clients</h3>
                  <p className="text-purple-200 text-sm">Gagnez 5€ par filleul</p>
                </div>
              </div>
              
              <p className="text-purple-100 text-sm mb-4">
                Plus vous parrainez de clients, plus vite votre zone sera activée !
              </p>

              <button
                onClick={copyReferralLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-700 rounded-xl font-bold hover:bg-purple-50 transition"
              >
                <Share2 size={18} />
                Copier mon lien de parrainage
              </button>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Vos parrainages</span>
                  <span className="text-white font-bold">{referralCount} clients</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-purple-200">Gains potentiels</span>
                  <span className="text-white font-bold">{referralCount * 5}€</span>
                </div>
              </div>
            </div>

            {/* Zone Status */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-teal-400" />
                Statut de votre zone
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-400">Ville</span>
                  <span className="font-bold text-white">{washerData?.city || 'Non définie'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-400">Clients inscrits</span>
                  <span className="font-bold text-emerald-400">{clientsInZone}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                  <span className="text-slate-400">Seuil d'activation</span>
                  <span className="font-bold text-white">50 clients</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progression zone</span>
                  <span className="text-teal-400">{Math.min(clientsInZone * 2, 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${Math.min(clientsInZone * 2, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="text-teal-400" />
                Notifications
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                  <TrendingUp className="text-teal-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-teal-300 font-medium">+3 clients cette semaine</p>
                    <p className="text-teal-400/70">dans votre zone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-xl">
                  <Users className="text-slate-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-slate-300">Lancement prévu</p>
                    <p className="text-slate-500">Quand 50 clients seront inscrits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <Link 
              to="/contact"
              className="block text-center p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-400 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              Une question ? Contactez-nous
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
