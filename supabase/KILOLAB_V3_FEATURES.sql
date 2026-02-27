-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - SCRIPT SQL COMPLET POUR NOUVELLES FONCTIONNALITÉS v3.0
-- À exécuter sur Supabase après les scripts RLS
-- ═══════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════
-- 1. TABLE SUBSCRIPTIONS (Abonnements récurrents)
-- ══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('weekly', 'biweekly', 'monthly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  weight_kg INTEGER DEFAULT 7,
  formula TEXT DEFAULT 'standard' CHECK (formula IN ('standard', 'express', 'express_2h')),
  pickup_address TEXT,
  preferred_day TEXT,
  preferred_slot TEXT,
  next_pickup TIMESTAMP WITH TIME ZONE,
  price_per_order DECIMAL(10, 2),
  discount_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paused_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_pickup ON public.subscriptions(next_pickup);

-- RLS pour subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_subscriptions ON public.subscriptions;
CREATE POLICY users_view_own_subscriptions ON public.subscriptions 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_manage_own_subscriptions ON public.subscriptions;
CREATE POLICY users_manage_own_subscriptions ON public.subscriptions 
  FOR ALL TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS admins_full_access_subscriptions ON public.subscriptions;
CREATE POLICY admins_full_access_subscriptions ON public.subscriptions 
  FOR ALL TO authenticated 
  USING (is_admin()) 
  WITH CHECK (is_admin());

-- ══════════════════════════════════════════════════════════════════════
-- 2. TABLE REWARD_REDEMPTIONS (Échanges de récompenses fidélité)
-- ══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  reward_type TEXT CHECK (reward_type IN ('discount', 'free_service', 'upgrade', 'gift')),
  points_used INTEGER NOT NULL,
  value_cents INTEGER, -- Valeur en centimes si applicable
  coupon_code TEXT, -- Code coupon généré si applicable
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user_id ON public.reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_coupon_code ON public.reward_redemptions(coupon_code);

-- RLS pour reward_redemptions
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_redemptions ON public.reward_redemptions;
CREATE POLICY users_view_own_redemptions ON public.reward_redemptions 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_create_redemptions ON public.reward_redemptions;
CREATE POLICY users_create_redemptions ON public.reward_redemptions 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS admins_full_access_redemptions ON public.reward_redemptions;
CREATE POLICY admins_full_access_redemptions ON public.reward_redemptions 
  FOR ALL TO authenticated 
  USING (is_admin()) 
  WITH CHECK (is_admin());

-- ══════════════════════════════════════════════════════════════════════
-- 3. AJOUTER LOYALTY_POINTS À USER_PROFILES
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;

ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS loyalty_level TEXT DEFAULT 'bronze' 
  CHECK (loyalty_level IN ('bronze', 'silver', 'gold', 'platinum'));

-- ══════════════════════════════════════════════════════════════════════
-- 4. FONCTION RPC POUR DÉDUIRE DES POINTS FIDÉLITÉ
-- ══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.deduct_loyalty_points(
  p_user_id UUID,
  p_points_to_deduct INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points INTEGER;
BEGIN
  -- Vérifier les points actuels
  SELECT loyalty_points INTO current_points
  FROM user_profiles
  WHERE id = p_user_id;
  
  IF current_points IS NULL OR current_points < p_points_to_deduct THEN
    RETURN FALSE;
  END IF;
  
  -- Déduire les points
  UPDATE user_profiles
  SET loyalty_points = loyalty_points - p_points_to_deduct
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════
-- 5. FONCTION RPC POUR AJOUTER DES POINTS FIDÉLITÉ
-- ══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.add_loyalty_points(
  p_user_id UUID,
  p_points_to_add INTEGER,
  p_reason TEXT DEFAULT 'order'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total INTEGER;
  new_level TEXT;
BEGIN
  -- Ajouter les points
  UPDATE user_profiles
  SET loyalty_points = COALESCE(loyalty_points, 0) + p_points_to_add
  WHERE id = p_user_id
  RETURNING loyalty_points INTO new_total;
  
  -- Mettre à jour le niveau
  IF new_total >= 5000 THEN
    new_level := 'platinum';
  ELSIF new_total >= 2000 THEN
    new_level := 'gold';
  ELSIF new_total >= 500 THEN
    new_level := 'silver';
  ELSE
    new_level := 'bronze';
  END IF;
  
  UPDATE user_profiles
  SET loyalty_level = new_level
  WHERE id = p_user_id;
  
  RETURN new_total;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════
-- 6. AJOUTER COLONNES POUR SUIVI COMMANDE
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP WITH TIME ZONE;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS washing_started_at TIMESTAMP WITH TIME ZONE;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS ready_at TIMESTAMP WITH TIME ZONE;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS pickup_photo_url TEXT;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS ready_photo_url TEXT;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS delivery_photo_url TEXT;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS eta_minutes INTEGER;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS washer_lat DECIMAL(10, 8);
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS washer_lng DECIMAL(11, 8);

-- ══════════════════════════════════════════════════════════════════════
-- 7. AJOUTER COLONNE ORDER_ID À MESSAGES (pour chat par commande)
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_messages_order_id ON public.messages(order_id);

-- ══════════════════════════════════════════════════════════════════════
-- 8. TRIGGER POUR AJOUTER DES POINTS APRÈS COMMANDE COMPLÉTÉE
-- ══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.on_order_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  points_to_add INTEGER;
  multiplier DECIMAL;
  user_level TEXT;
BEGIN
  -- Seulement si passage à "completed"
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Récupérer le niveau de fidélité pour le multiplicateur
    SELECT loyalty_level INTO user_level
    FROM user_profiles
    WHERE id = NEW.client_id;
    
    -- Calculer le multiplicateur selon le niveau
    CASE user_level
      WHEN 'platinum' THEN multiplier := 3.0;
      WHEN 'gold' THEN multiplier := 2.0;
      WHEN 'silver' THEN multiplier := 1.5;
      ELSE multiplier := 1.0;
    END CASE;
    
    -- 10 points par euro * multiplicateur
    points_to_add := FLOOR(COALESCE(NEW.total_price, 0) * 10 * multiplier);
    
    -- Ajouter les points
    IF points_to_add > 0 THEN
      PERFORM add_loyalty_points(NEW.client_id, points_to_add, 'order_completed');
    END IF;
    
    -- Enregistrer la date de complétion
    NEW.completed_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Supprimer le trigger s'il existe et le recréer
DROP TRIGGER IF EXISTS trigger_order_completed ON public.orders;
CREATE TRIGGER trigger_order_completed
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION on_order_completed();

-- ══════════════════════════════════════════════════════════════════════
-- 9. VÉRIFICATION FINALE
-- ══════════════════════════════════════════════════════════════════════

-- Vérifier que toutes les tables existent
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ OK'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('subscriptions', 'reward_redemptions', 'user_profiles', 'orders', 'messages')
ORDER BY table_name;

-- Vérifier les colonnes ajoutées
SELECT 
  column_name,
  table_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
AND column_name IN ('loyalty_points', 'loyalty_level');

-- Vérifier les fonctions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('deduct_loyalty_points', 'add_loyalty_points', 'on_order_completed');

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN DU SCRIPT - TOUTES LES FONCTIONNALITÉS v3.0 SONT PRÊTES !
-- ═══════════════════════════════════════════════════════════════════════════
