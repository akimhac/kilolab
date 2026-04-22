-- ═══════════════════════════════════════════════════════════════════════
-- KILOLAB MEGA FIX - SECURITE + EXPERIENCE + FINANCE
-- Date: 19/04/2026 - A executer EN UNE SEULE FOIS
-- ═══════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════
-- 0. PREREQUIS : Fonction admin helper
-- ══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ══════════════════════════════════════════════
-- PARTIE 1 : SECURITE - RLS SUR TOUTES LES TABLES
-- ══════════════════════════════════════════════

-- Tables principales
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS b2b_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS b2b_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washer_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;

-- Tables secondaires (potentiellement sans RLS)
ALTER TABLE IF EXISTS error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS account_deletions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loyalty_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS partner_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promo_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promo_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washer_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washer_location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Policies admin bypass sur toutes les tables principales
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'user_profiles','orders','washers','partners','reviews','messages',
    'notifications','coupons','disputes','referrals','loyalty_points',
    'contact_messages','subscriptions','b2b_partners','b2b_api_logs',
    'washer_locations','analytics_events','error_logs','order_photos',
    'support_responses','account_deletions','documents','loyalty_redemptions',
    'loyalty_rewards','loyalty_transactions','partner_promotions','promo_codes',
    'promo_stats','promo_usage','referral_codes','washer_ratings','washer_orders',
    'washer_location_history','reward_redemptions'
  ])
  LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
      EXECUTE format('DROP POLICY IF EXISTS admin_full_access_%I ON %I', tbl, tbl);
      EXECUTE format('CREATE POLICY admin_full_access_%I ON %I FOR ALL USING (is_admin())', tbl, tbl);
    END IF;
  END LOOP;
END $$;

-- Policies utilisateur pour tables secondaires
DROP POLICY IF EXISTS auth_insert_error_logs ON error_logs;
CREATE POLICY auth_insert_error_logs ON error_logs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS auth_select_error_logs ON error_logs;
CREATE POLICY auth_select_error_logs ON error_logs FOR SELECT TO authenticated USING (is_admin());

DROP POLICY IF EXISTS users_view_order_photos ON order_photos;
CREATE POLICY users_view_order_photos ON order_photos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS users_insert_order_photos ON order_photos;
CREATE POLICY users_insert_order_photos ON order_photos FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS public_view_rewards ON loyalty_rewards;
CREATE POLICY public_view_rewards ON loyalty_rewards FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS public_view_promo_codes ON promo_codes;
CREATE POLICY public_view_promo_codes ON promo_codes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS public_view_ratings ON washer_ratings;
CREATE POLICY public_view_ratings ON washer_ratings FOR SELECT USING (true);
DROP POLICY IF EXISTS clients_create_ratings ON washer_ratings;
CREATE POLICY clients_create_ratings ON washer_ratings FOR INSERT TO authenticated WITH CHECK (true);

-- Fix orders SELECT pour washers (washer_id = washers.id, PAS auth.uid)
DROP POLICY IF EXISTS clients_view_own_orders ON orders;
CREATE POLICY clients_view_own_orders ON orders FOR SELECT USING (
  auth.uid() = client_id
  OR EXISTS (SELECT 1 FROM washers w WHERE w.id = orders.washer_id AND w.user_id = auth.uid())
  OR is_admin()
);

-- Fix orders UPDATE pour washers
DROP POLICY IF EXISTS washers_update_orders ON orders;
CREATE POLICY washers_update_orders ON orders FOR UPDATE TO authenticated
USING (
  auth.uid() = client_id
  OR EXISTS (SELECT 1 FROM public.washers w WHERE w.user_id = auth.uid() AND (w.id = orders.washer_id OR orders.washer_id IS NULL) AND w.status = 'approved')
  OR is_admin()
)
WITH CHECK (
  auth.uid() = client_id
  OR EXISTS (SELECT 1 FROM public.washers w WHERE w.user_id = auth.uid() AND w.status = 'approved')
  OR is_admin()
);

-- ══════════════════════════════════════════════
-- PARTIE 2 : AUDIT LOGS (Tracabilite admin)
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_full_access_audit_logs ON audit_logs;
CREATE POLICY admin_full_access_audit_logs ON audit_logs FOR ALL USING (is_admin());
DROP POLICY IF EXISTS service_insert_audit ON audit_logs;
CREATE POLICY service_insert_audit ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ══════════════════════════════════════════════
-- PARTIE 3 : WASHER DISPONIBILITES
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.washer_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  washer_id UUID NOT NULL REFERENCES public.washers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '20:00',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(washer_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS public.washer_off_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  washer_id UUID NOT NULL REFERENCES public.washers(id) ON DELETE CASCADE,
  off_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(washer_id, off_date)
);

ALTER TABLE IF EXISTS washer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washer_off_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_full_access_washer_availability ON washer_availability;
CREATE POLICY admin_full_access_washer_availability ON washer_availability FOR ALL USING (is_admin());
DROP POLICY IF EXISTS washers_manage_availability ON washer_availability;
CREATE POLICY washers_manage_availability ON washer_availability FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM washers w WHERE w.id = washer_availability.washer_id AND w.user_id = auth.uid())
);

DROP POLICY IF EXISTS admin_full_access_washer_off_days ON washer_off_days;
CREATE POLICY admin_full_access_washer_off_days ON washer_off_days FOR ALL USING (is_admin());
DROP POLICY IF EXISTS washers_manage_off_days ON washer_off_days;
CREATE POLICY washers_manage_off_days ON washer_off_days FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM washers w WHERE w.id = washer_off_days.washer_id AND w.user_id = auth.uid())
);

-- ══════════════════════════════════════════════
-- PARTIE 4 : GAMIFICATION (Badges washer)
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.washer_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  washer_id UUID NOT NULL REFERENCES public.washers(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(washer_id, badge_type)
);

ALTER TABLE IF EXISTS washer_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_full_access_washer_badges ON washer_badges;
CREATE POLICY admin_full_access_washer_badges ON washer_badges FOR ALL USING (is_admin());
DROP POLICY IF EXISTS washers_view_own_badges ON washer_badges;
CREATE POLICY washers_view_own_badges ON washer_badges FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM washers w WHERE w.id = washer_badges.washer_id AND w.user_id = auth.uid())
);
DROP POLICY IF EXISTS public_view_badges ON washer_badges;
CREATE POLICY public_view_badges ON washer_badges FOR SELECT USING (true);

-- Fonction auto-attribution badges
CREATE OR REPLACE FUNCTION check_washer_badges()
RETURNS TRIGGER AS $$
DECLARE
  completed_count INTEGER;
  w_id UUID;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.washer_id IS NOT NULL THEN
    w_id := NEW.washer_id;
    SELECT COUNT(*) INTO completed_count FROM orders WHERE washer_id = w_id AND status = 'completed';

    -- Badge 1ere mission
    IF completed_count = 1 THEN
      INSERT INTO washer_badges (washer_id, badge_type, badge_name)
      VALUES (w_id, 'first_mission', 'Premiere Mission') ON CONFLICT DO NOTHING;
    END IF;
    -- 10 missions
    IF completed_count >= 10 THEN
      INSERT INTO washer_badges (washer_id, badge_type, badge_name)
      VALUES (w_id, 'ten_missions', '10 Missions') ON CONFLICT DO NOTHING;
    END IF;
    -- 50 missions
    IF completed_count >= 50 THEN
      INSERT INTO washer_badges (washer_id, badge_type, badge_name)
      VALUES (w_id, 'fifty_missions', 'Expert 50') ON CONFLICT DO NOTHING;
    END IF;
    -- 100 missions
    IF completed_count >= 100 THEN
      INSERT INTO washer_badges (washer_id, badge_type, badge_name)
      VALUES (w_id, 'hundred_missions', 'Legende 100') ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Badge check error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_badges ON orders;
CREATE TRIGGER trigger_check_badges
  AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION check_washer_badges();

-- ══════════════════════════════════════════════
-- PARTIE 5 : DETECTION FRAUDE
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  description TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS fraud_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_full_access_fraud_alerts ON fraud_alerts;
CREATE POLICY admin_full_access_fraud_alerts ON fraud_alerts FOR ALL USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user ON fraud_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_type ON fraud_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_unresolved ON fraud_alerts(resolved) WHERE resolved = false;

-- Fonction detection fraude automatique
CREATE OR REPLACE FUNCTION detect_fraud()
RETURNS TRIGGER AS $$
DECLARE
  cancel_count INTEGER;
  complete_count_1h INTEGER;
BEGIN
  -- Fraude: client annule plus de 5 commandes
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    SELECT COUNT(*) INTO cancel_count FROM orders
    WHERE client_id = NEW.client_id AND status = 'cancelled'
    AND created_at > NOW() - INTERVAL '30 days';

    IF cancel_count >= 5 THEN
      INSERT INTO fraud_alerts (user_id, alert_type, severity, description, details)
      VALUES (NEW.client_id, 'excessive_cancellations', 'high',
        'Client a annule ' || cancel_count || ' commandes en 30 jours',
        jsonb_build_object('cancel_count', cancel_count, 'order_id', NEW.id));
    END IF;
  END IF;

  -- Fraude: washer valide plus de 8 commandes en 1h
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.washer_id IS NOT NULL THEN
    SELECT COUNT(*) INTO complete_count_1h FROM orders
    WHERE washer_id = NEW.washer_id AND status = 'completed'
    AND completed_at > NOW() - INTERVAL '1 hour';

    IF complete_count_1h >= 8 THEN
      INSERT INTO fraud_alerts (user_id, alert_type, severity, description, details)
      VALUES (
        (SELECT user_id FROM washers WHERE id = NEW.washer_id),
        'suspicious_completions', 'critical',
        'Washer a valide ' || complete_count_1h || ' commandes en 1h',
        jsonb_build_object('count', complete_count_1h, 'washer_id', NEW.washer_id));
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Fraud detection error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_fraud_detection ON orders;
CREATE TRIGGER trigger_fraud_detection
  AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION detect_fraud();

-- ══════════════════════════════════════════════
-- PARTIE 6 : COLONNES SUPPLEMENTAIRES
-- ══════════════════════════════════════════════

-- Re-order tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS reorder_from UUID REFERENCES orders(id);

-- Session timeout (ajouter last_active pour tracking)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Washer onboarding tracking
ALTER TABLE washers ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE washers ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- ══════════════════════════════════════════════
-- VERIFICATION FINALE
-- ══════════════════════════════════════════════
SELECT
  tablename,
  CASE WHEN rowsecurity THEN 'RLS ACTIF' ELSE 'RLS MANQUANT' END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC, tablename;
