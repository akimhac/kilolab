import { supabase } from '../lib/supabase';

export interface LoyaltyPoints {
  id: string;
  user_id: string;
  points: number;
  lifetime_points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  points: number;
  type: string;
  description: string;
  created_at: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_tier: string;
  is_active: boolean;
}

export interface LoyaltyRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  order_id?: string;
  points_spent: number;
  discount_applied: number;
  redeemed_at: string;
  expires_at: string;
  used: boolean;
  loyalty_rewards?: LoyaltyReward; // Join avec la table rewards
}

export const loyaltyService = {
  // Récupérer les points de l'utilisateur
  async getUserPoints(userId: string): Promise<LoyaltyPoints | null> {
    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur getUserPoints:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception getUserPoints:', error);
      return null;
    }
  },

  // Récupérer l'historique des transactions
  async getUserTransactions(userId: string): Promise<LoyaltyTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erreur getUserTransactions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception getUserTransactions:', error);
      return [];
    }
  },

  // Récupérer les récompenses disponibles
  async getAvailableRewards(): Promise<LoyaltyReward[]> {
    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost');

      if (error) {
        console.error('Erreur getAvailableRewards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception getAvailableRewards:', error);
      return [];
    }
  },

  // Utiliser une récompense
  async redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; error?: string; redemption?: any }> {
    try {
      const { data, error } = await supabase.rpc('redeem_loyalty_reward', {
        p_user_id: userId,
        p_reward_id: rewardId
      });

      if (error) {
        console.error('Erreur redeemReward:', error);
        return { success: false, error: error.message };
      }

      return data || { success: false, error: 'Erreur inconnue' };
    } catch (error: any) {
      console.error('Exception redeemReward:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les coupons actifs de l'utilisateur
  async getUserActiveCoupons(userId: string): Promise<LoyaltyRedemption[]> {
    try {
      const { data, error } = await supabase
        .from('loyalty_redemptions')
        .select('*, loyalty_rewards(*)')
        .eq('user_id', userId)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at');

      if (error) {
        console.error('Erreur getUserActiveCoupons:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception getUserActiveCoupons:', error);
      return [];
    }
  },

  // Calculer le prochain palier
  getNextTierInfo(currentTier: string, lifetimePoints: number) {
    const tiers = [
      { name: 'bronze', minPoints: 0 },
      { name: 'silver', minPoints: 500 },
      { name: 'gold', minPoints: 2000 },
      { name: 'platinum', minPoints: 5000 },
      { name: 'vip', minPoints: 10000 }
    ];

    const currentIndex = tiers.findIndex(t => t.name === currentTier);
    
    if (currentIndex === tiers.length - 1) {
      return { isMaxTier: true, name: 'vip', pointsNeeded: 0 };
    }

    const nextTier = tiers[currentIndex + 1];
    const pointsNeeded = nextTier.minPoints - lifetimePoints;

    return {
      isMaxTier: false,
      name: nextTier.name,
      pointsNeeded: Math.max(0, pointsNeeded)
    };
  },

  // Obtenir l'icône du tier
  getTierIcon(tier: string): string {
    const icons: Record<string, string> = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎',
      vip: '👑'
    };
    return icons[tier] || '🥉';
  },

  // Obtenir la couleur du tier
  getTierColor(tier: string): string {
    const colors: Record<string, string> = {
      bronze: 'from-orange-600 to-orange-800',
      silver: 'from-slate-400 to-slate-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-cyan-400 to-blue-600',
      vip: 'from-purple-500 to-pink-600'
    };
    return colors[tier] || 'from-slate-400 to-slate-600';
  }
};
