// Programme de Fidélité - Points, Bronze/Silver/Gold
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Star, Crown, Gift, Zap, ChevronRight, Lock, Check, TrendingUp } from 'lucide-react';
import { FadeInOnScroll } from './animations/ScrollAnimations';

interface LoyaltyData {
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  ordersCount: number;
  availableRewards: Reward[];
  redeemedRewards: Reward[];
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  type: 'discount' | 'free_service' | 'upgrade' | 'gift';
  value?: number;
  is_redeemed?: boolean;
  redeemed_at?: string;
}

const LEVELS = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    color: 'from-amber-600 to-amber-700',
    icon: '🥉',
    multiplier: 1,
    perks: ['10 points/€ dépensé', 'Accès aux récompenses de base'],
  },
  silver: {
    name: 'Silver',
    minPoints: 500,
    color: 'from-slate-400 to-slate-500',
    icon: '🥈',
    multiplier: 1.5,
    perks: ['15 points/€ dépensé', 'Priorité de matching', '-5% permanent'],
  },
  gold: {
    name: 'Gold',
    minPoints: 2000,
    color: 'from-yellow-400 to-amber-500',
    icon: '🥇',
    multiplier: 2,
    perks: ['20 points/€ dépensé', 'Express offert 1x/mois', '-10% permanent'],
  },
  platinum: {
    name: 'Platinum',
    minPoints: 5000,
    color: 'from-purple-400 to-pink-500',
    icon: '💎',
    multiplier: 3,
    perks: ['30 points/€ dépensé', 'Express illimité', '-15% permanent', 'Accès VIP'],
  },
};

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: 'Réduction 5€', description: '-5€ sur votre prochaine commande', points_required: 200, type: 'discount', value: 5 },
  { id: '2', name: 'Réduction 10€', description: '-10€ sur votre prochaine commande', points_required: 400, type: 'discount', value: 10 },
  { id: '3', name: 'Lavage gratuit 5kg', description: 'Un lavage standard offert jusqu\'à 5kg', points_required: 600, type: 'free_service' },
  { id: '4', name: 'Upgrade Express', description: 'Passez en Express gratuitement', points_required: 300, type: 'upgrade' },
  { id: '5', name: 'Réduction 20€', description: '-20€ sur votre prochaine commande', points_required: 800, type: 'discount', value: 20 },
  { id: '6', name: 'Mois Express offert', description: 'Express gratuit pendant 1 mois', points_required: 1500, type: 'upgrade' },
];

function getLevel(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (points >= LEVELS.platinum.minPoints) return 'platinum';
  if (points >= LEVELS.gold.minPoints) return 'gold';
  if (points >= LEVELS.silver.minPoints) return 'silver';
  return 'bronze';
}

function getNextLevel(current: 'bronze' | 'silver' | 'gold' | 'platinum'): 'silver' | 'gold' | 'platinum' | null {
  if (current === 'bronze') return 'silver';
  if (current === 'silver') return 'gold';
  if (current === 'gold') return 'platinum';
  return null;
}

export function LoyaltyCard({ userId }: { userId: string }) {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, [userId]);

  const fetchLoyaltyData = async () => {
    try {
      // Get user's loyalty points
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('loyalty_points')
        .eq('id', userId)
        .single();

      // Get orders for stats
      const { data: orders } = await supabase
        .from('orders')
        .select('total_price')
        .eq('client_id', userId)
        .eq('status', 'completed');

      const points = profile?.loyalty_points || 0;
      const totalSpent = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
      const level = getLevel(points);

      setData({
        points,
        level,
        totalSpent,
        ordersCount: orders?.length || 0,
        availableRewards: DEFAULT_REWARDS.filter(r => r.points_required <= points),
        redeemedRewards: [],
      });
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl p-6 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/2 mb-4" />
        <div className="h-12 bg-white/20 rounded w-1/3 mb-4" />
        <div className="h-4 bg-white/20 rounded w-full" />
      </div>
    );
  }

  if (!data) return null;

  const levelInfo = LEVELS[data.level];
  const nextLevel = getNextLevel(data.level);
  const nextLevelInfo = nextLevel ? LEVELS[nextLevel] : null;
  const pointsToNext = nextLevelInfo ? nextLevelInfo.minPoints - data.points : 0;
  const progress = nextLevelInfo 
    ? ((data.points - levelInfo.minPoints) / (nextLevelInfo.minPoints - levelInfo.minPoints)) * 100
    : 100;

  return (
    <div className={`bg-gradient-to-br ${levelInfo.color} rounded-3xl p-6 text-white shadow-xl overflow-hidden relative`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl">
              {levelInfo.icon}
            </div>
            <div>
              <h3 className="font-black text-xl">Niveau {levelInfo.name}</h3>
              <p className="text-white/70 text-sm">x{levelInfo.multiplier} points par €</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{data.points.toLocaleString()}</p>
            <p className="text-white/70 text-xs">points</p>
          </div>
        </div>

        {/* Progress to next level */}
        {nextLevelInfo && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>{levelInfo.name}</span>
              <span>{pointsToNext} pts pour {nextLevelInfo.name}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-white/70 text-xs mb-1">Total dépensé</p>
            <p className="font-bold text-lg">{data.totalSpent.toFixed(0)}€</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <p className="text-white/70 text-xs mb-1">Commandes</p>
            <p className="font-bold text-lg">{data.ordersCount}</p>
          </div>
        </div>

        {/* Perks */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-3">
          <p className="text-xs text-white/70 mb-2 flex items-center gap-1">
            <Crown size={12} /> Avantages {levelInfo.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {levelInfo.perks.map((perk, idx) => (
              <span key={idx} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                ✓ {perk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RewardsGrid({ userId, points }: { userId: string; points: number }) {
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const redeemReward = async (reward: Reward) => {
    if (points < reward.points_required) {
      return;
    }

    setRedeeming(reward.id);
    try {
      // Deduct points
      const { error } = await supabase.rpc('deduct_loyalty_points', {
        user_id: userId,
        points_to_deduct: reward.points_required,
      });

      if (error) throw error;

      // Create reward redemption record
      await supabase.from('reward_redemptions').insert({
        user_id: userId,
        reward_id: reward.id,
        reward_name: reward.name,
        points_used: reward.points_required,
      });

      // Refresh page or update state
      window.location.reload();
    } catch (error) {
      console.error('Error redeeming reward:', error);
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <Gift className="text-teal-500" /> Récompenses
      </h3>
      
      <div className="grid gap-3">
        {DEFAULT_REWARDS.map((reward) => {
          const canRedeem = points >= reward.points_required;
          const isRedeeming = redeeming === reward.id;
          
          return (
            <FadeInOnScroll key={reward.id} direction="up">
              <div className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                canRedeem ? 'border-teal-200 hover:border-teal-400' : 'border-slate-100 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      canRedeem ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {reward.type === 'discount' && <span className="font-black">-{reward.value}€</span>}
                      {reward.type === 'free_service' && <Gift size={24} />}
                      {reward.type === 'upgrade' && <Zap size={24} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{reward.name}</p>
                      <p className="text-sm text-slate-500">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${canRedeem ? 'text-teal-600' : 'text-slate-400'}`}>
                      {reward.points_required} pts
                    </p>
                    <button
                      onClick={() => redeemReward(reward)}
                      disabled={!canRedeem || isRedeeming}
                      className={`mt-1 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        canRedeem
                          ? 'bg-teal-500 text-white hover:bg-teal-600'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isRedeeming ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : canRedeem ? (
                        'Échanger'
                      ) : (
                        <Lock size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          );
        })}
      </div>
    </div>
  );
}

// How it works section
export function LoyaltyExplainer() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 border border-slate-100">
      <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
        <TrendingUp className="text-teal-500" /> Comment ça marche ?
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold flex-shrink-0">
            1
          </div>
          <div>
            <p className="font-bold text-slate-900">Gagnez des points</p>
            <p className="text-sm text-slate-500">10 points pour chaque € dépensé (jusqu'à 30 pts en Platinum)</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold flex-shrink-0">
            2
          </div>
          <div>
            <p className="font-bold text-slate-900">Montez en niveau</p>
            <p className="text-sm text-slate-500">Bronze → Silver → Gold → Platinum avec des avantages croissants</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold flex-shrink-0">
            3
          </div>
          <div>
            <p className="font-bold text-slate-900">Échangez vos récompenses</p>
            <p className="text-sm text-slate-500">Réductions, services gratuits, upgrades Express...</p>
          </div>
        </div>
      </div>

      {/* Level comparison */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {(Object.keys(LEVELS) as Array<keyof typeof LEVELS>).map((key) => {
          const level = LEVELS[key];
          return (
            <div 
              key={key}
              className={`bg-gradient-to-br ${level.color} rounded-xl p-3 text-white text-center`}
            >
              <span className="text-2xl">{level.icon}</span>
              <p className="font-bold text-xs mt-1">{level.name}</p>
              <p className="text-white/70 text-xs">{level.minPoints}+ pts</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default { LoyaltyCard, RewardsGrid, LoyaltyExplainer };
