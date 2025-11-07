import { supabase } from './supabase';

export const generateUniquePromoCode = (userName: string): string => {
  const base = userName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'KILO');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}${random}`;
};

export const validatePromoCode = async (code: string, userId: string) => {
  try {
    // Vérifier que le code existe et est actif
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (!promo) {
      return { valid: false, message: 'Code promo invalide' };
    }

    // Vérifier date expiration
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return { valid: false, message: 'Code promo expire' };
    }

    // Vérifier limite utilisation globale
    if (promo.max_uses && promo.uses_count >= promo.max_uses) {
      return { valid: false, message: 'Code promo epuise' };
    }

    // ✅ VÉRIFIER SI DÉJÀ UTILISÉ PAR CE CLIENT
    const { data: usage } = await supabase
      .from('promo_usage')
      .select('id')
      .eq('promo_code_id', promo.id)
      .eq('user_id', userId)
      .single();

    if (usage) {
      return { valid: false, message: 'Vous avez deja utilise ce code' };
    }

    return {
      valid: true,
      discount: promo.discount_type === 'percent' ? promo.discount_value : null,
      fixedAmount: promo.discount_type === 'fixed' ? promo.discount_value : null,
      promoId: promo.id
    };
  } catch (error) {
    return { valid: false, message: 'Erreur validation' };
  }
};

export const applyPromoCode = async (
  promoCodeId: string,
  userId: string,
  orderId: string
) => {
  // Enregistrer utilisation
  await supabase.from('promo_usage').insert({
    promo_code_id: promoCodeId,
    user_id: userId,
    order_id: orderId,
  });

  // Incrémenter compteur
  await supabase.rpc('increment_promo_usage', { promo_id: promoCodeId });
};
