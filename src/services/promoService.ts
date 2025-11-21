import { supabase } from '../lib/supabase';

export interface PartnerPromotion {
  id: string;
  partner_id: string;
  promo_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const promoService = {
  // Vérifier si pressing a une promo active
  async hasActivePromo(partnerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_active_promo', {
        p_partner_id: partnerId
      });

      if (error) {
        console.error('Erreur hasActivePromo:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Exception hasActivePromo:', error);
      return false;
    }
  },

  // Récupérer la promo d'un pressing
  async getPartnerPromo(partnerId: string): Promise<PartnerPromotion | null> {
    try {
      const { data, error } = await supabase
        .from('partner_promotions')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('is_active', true)
        .gt('end_date', new Date().toISOString())
        .single();

      if (error) {
        console.error('Erreur getPartnerPromo:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception getPartnerPromo:', error);
      return null;
    }
  },

  // Stats promo en temps réel
  async getPromoStats(): Promise<{ totalPromos: number; freeMonthCount: number; remainingSlots: number }> {
    try {
      const { data, error } = await supabase
        .from('promo_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Erreur getPromoStats:', error);
        return { totalPromos: 0, freeMonthCount: 0, remainingSlots: 100 };
      }

      return {
        totalPromos: data.total_promos_actives || 0,
        freeMonthCount: data.free_month_count || 0,
        remainingSlots: data.remaining_slots || 100
      };
    } catch (error) {
      console.error('Exception getPromoStats:', error);
      return { totalPromos: 0, freeMonthCount: 0, remainingSlots: 100 };
    }
  },

  // Calculer jours restants promo
  getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
};
