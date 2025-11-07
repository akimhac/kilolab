import { supabase } from './supabase';

export const validatePromoCode = async (code: string, userId: string) => {
  try {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (!promo) {
      return { valid: false, message: 'Code promo invalide' };
    }

    // Vérifier date d'expiration
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return { valid: false, message: 'Code promo expiré' };
    }

    // Vérifier limite d'utilisation
    if (promo.max_uses && promo.uses_count >= promo.max_uses) {
      return { valid: false, message: 'Code promo épuisé' };
    }

    // Vérifier si déjà utilisé par ce client
    const { data: usage } = await supabase
      .from('promo_usage')
      .select('id')
      .eq('promo_code_id', promo.id)
      .eq('user_id', userId)
      .single();

    if (usage && !promo.allow_multiple_uses) {
      return { valid: false, message: 'Code déjà utilisé' };
    }

    return {
      valid: true,
      discount: promo.discount_type === 'percent' ? promo.discount_value : null,
      fixedAmount: promo.discount_type === 'fixed' ? promo.discount_value : null,
    };
  } catch (error) {
    return { valid: false, message: 'Erreur de validation' };
  }
};

export const applyPromoCode = async (
  promoCodeId: string,
  userId: string,
  orderId: string
) => {
  await supabase.from('promo_usage').insert({
    promo_code_id: promoCodeId,
    user_id: userId,
    order_id: orderId,
  });

  await supabase.rpc('increment_promo_usage', { promo_id: promoCodeId });
};
