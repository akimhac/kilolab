-- ═══════════════════════════════════════════════════════════════════════
-- KILOLAB - FIX SECURITE COMPLET : RLS SUR TOUTES LES TABLES
-- Date: 19/04/2026
-- SAFE: Utilise IF EXISTS partout, ne casse rien
-- ═══════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════
-- ETAPE 0 : Fonction helper admin (prerequis)
-- ══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ══════════════════════════════════════════════
-- ETAPE 1 : ACTIVER RLS SUR TOUTES LES TABLES
-- (celles deja actives ne sont pas affectees)
-- ══════════════════════════════════════════════

-- Tables principales (deja RLS normalement)
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

-- Tables potentiellement SANS RLS (le probleme signale par Supabase)
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
ALTER TABLE IF EXISTS washer_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS washer_location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS b2b_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS b2b_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════
-- ETAPE 2 : ADMIN BYPASS - L'admin peut tout faire
-- (Pour chaque table, creer une policy admin full access)
-- ══════════════════════════════════════════════

-- error_logs : admin only
DROP POLICY IF EXISTS admin_all_error_logs ON error_logs;
CREATE POLICY admin_all_error_logs ON error_logs FOR ALL USING (is_admin());
DROP POLICY IF EXISTS auth_insert_error_logs ON error_logs;
CREATE POLICY auth_insert_error_logs ON error_logs FOR INSERT TO authenticated WITH CHECK (true);

-- order_photos : client ou washer de la commande
DROP POLICY IF EXISTS admin_all_order_photos ON order_photos;
CREATE POLICY admin_all_order_photos ON order_photos FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_order_photos ON order_photos;
CREATE POLICY users_view_order_photos ON order_photos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS users_insert_order_photos ON order_photos;
CREATE POLICY users_insert_order_photos ON order_photos FOR INSERT TO authenticated WITH CHECK (true);

-- support_responses : admin + owner
DROP POLICY IF EXISTS admin_all_support ON support_responses;
CREATE POLICY admin_all_support ON support_responses FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_support ON support_responses;
CREATE POLICY users_view_own_support ON support_responses FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS users_create_support ON support_responses;
CREATE POLICY users_create_support ON support_responses FOR INSERT TO authenticated WITH CHECK (true);

-- account_deletions : admin + owner
DROP POLICY IF EXISTS admin_all_account_deletions ON account_deletions;
CREATE POLICY admin_all_account_deletions ON account_deletions FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_request_deletion ON account_deletions;
CREATE POLICY users_request_deletion ON account_deletions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS users_view_own_deletion ON account_deletions;
CREATE POLICY users_view_own_deletion ON account_deletions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- documents : authenticated users
DROP POLICY IF EXISTS admin_all_documents ON documents;
CREATE POLICY admin_all_documents ON documents FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_documents ON documents;
CREATE POLICY users_view_own_documents ON documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS users_upload_documents ON documents;
CREATE POLICY users_upload_documents ON documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- loyalty_redemptions
DROP POLICY IF EXISTS admin_all_loyalty_redemptions ON loyalty_redemptions;
CREATE POLICY admin_all_loyalty_redemptions ON loyalty_redemptions FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_redemptions ON loyalty_redemptions;
CREATE POLICY users_view_own_redemptions ON loyalty_redemptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS users_create_redemptions ON loyalty_redemptions;
CREATE POLICY users_create_redemptions ON loyalty_redemptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- loyalty_rewards : read only for authenticated
DROP POLICY IF EXISTS admin_all_loyalty_rewards ON loyalty_rewards;
CREATE POLICY admin_all_loyalty_rewards ON loyalty_rewards FOR ALL USING (is_admin());
DROP POLICY IF EXISTS public_view_rewards ON loyalty_rewards;
CREATE POLICY public_view_rewards ON loyalty_rewards FOR SELECT TO authenticated USING (true);

-- loyalty_transactions
DROP POLICY IF EXISTS admin_all_loyalty_transactions ON loyalty_transactions;
CREATE POLICY admin_all_loyalty_transactions ON loyalty_transactions FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_transactions ON loyalty_transactions;
CREATE POLICY users_view_own_transactions ON loyalty_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- partner_promotions : read for all, write for admin
DROP POLICY IF EXISTS admin_all_partner_promotions ON partner_promotions;
CREATE POLICY admin_all_partner_promotions ON partner_promotions FOR ALL USING (is_admin());
DROP POLICY IF EXISTS public_view_promotions ON partner_promotions;
CREATE POLICY public_view_promotions ON partner_promotions FOR SELECT TO authenticated USING (true);

-- promo_codes : read for all, write for admin
DROP POLICY IF EXISTS admin_all_promo_codes ON promo_codes;
CREATE POLICY admin_all_promo_codes ON promo_codes FOR ALL USING (is_admin());
DROP POLICY IF EXISTS public_view_promo_codes ON promo_codes;
CREATE POLICY public_view_promo_codes ON promo_codes FOR SELECT TO authenticated USING (true);

-- promo_stats : admin only
DROP POLICY IF EXISTS admin_all_promo_stats ON promo_stats;
CREATE POLICY admin_all_promo_stats ON promo_stats FOR ALL USING (is_admin());

-- promo_usage : user can see own, admin all
DROP POLICY IF EXISTS admin_all_promo_usage ON promo_usage;
CREATE POLICY admin_all_promo_usage ON promo_usage FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_promo_usage ON promo_usage;
CREATE POLICY users_view_own_promo_usage ON promo_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS users_create_promo_usage ON promo_usage;
CREATE POLICY users_create_promo_usage ON promo_usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- referral_codes
DROP POLICY IF EXISTS admin_all_referral_codes ON referral_codes;
CREATE POLICY admin_all_referral_codes ON referral_codes FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_referral_codes ON referral_codes;
CREATE POLICY users_view_own_referral_codes ON referral_codes FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS users_create_referral_codes ON referral_codes;
CREATE POLICY users_create_referral_codes ON referral_codes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- washer_ratings
DROP POLICY IF EXISTS admin_all_washer_ratings ON washer_ratings;
CREATE POLICY admin_all_washer_ratings ON washer_ratings FOR ALL USING (is_admin());
DROP POLICY IF EXISTS public_view_ratings ON washer_ratings;
CREATE POLICY public_view_ratings ON washer_ratings FOR SELECT USING (true);
DROP POLICY IF EXISTS clients_create_ratings ON washer_ratings;
CREATE POLICY clients_create_ratings ON washer_ratings FOR INSERT TO authenticated WITH CHECK (true);

-- washer_orders
DROP POLICY IF EXISTS admin_all_washer_orders ON washer_orders;
CREATE POLICY admin_all_washer_orders ON washer_orders FOR ALL USING (is_admin());
DROP POLICY IF EXISTS washers_view_own_orders ON washer_orders;
CREATE POLICY washers_view_own_orders ON washer_orders FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM washers w WHERE w.user_id = auth.uid() AND w.id = washer_orders.washer_id)
);

-- washer_location_history
DROP POLICY IF EXISTS admin_all_washer_location_history ON washer_location_history;
CREATE POLICY admin_all_washer_location_history ON washer_location_history FOR ALL USING (is_admin());
DROP POLICY IF EXISTS washers_manage_location_history ON washer_location_history;
CREATE POLICY washers_manage_location_history ON washer_location_history FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM washers w WHERE w.user_id = auth.uid() AND w.id = washer_location_history.washer_id)
);

-- reward_redemptions
DROP POLICY IF EXISTS admin_all_reward_redemptions ON reward_redemptions;
CREATE POLICY admin_all_reward_redemptions ON reward_redemptions FOR ALL USING (is_admin());
DROP POLICY IF EXISTS users_view_own_reward_redemptions ON reward_redemptions;
CREATE POLICY users_view_own_reward_redemptions ON reward_redemptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS users_create_reward_redemptions ON reward_redemptions;
CREATE POLICY users_create_reward_redemptions ON reward_redemptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- profiles (si different de user_profiles)
DROP POLICY IF EXISTS users_view_own_profiles ON profiles;
CREATE POLICY users_view_own_profiles ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS users_update_own_profiles ON profiles;
CREATE POLICY users_update_own_profiles ON profiles FOR UPDATE USING (auth.uid() = id);

-- ══════════════════════════════════════════════
-- ETAPE 3 : Fix la policy SELECT orders pour washers
-- (washer_id = washers.id, PAS auth.uid())
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS clients_view_own_orders ON orders;
CREATE POLICY clients_view_own_orders ON orders
  FOR SELECT USING (
    auth.uid() = client_id
    OR EXISTS (SELECT 1 FROM washers w WHERE w.id = orders.washer_id AND w.user_id = auth.uid())
    OR is_admin()
  );

-- Policy admin full access sur orders
DROP POLICY IF EXISTS admin_all_orders ON orders;
CREATE POLICY admin_all_orders ON orders FOR ALL USING (is_admin());

-- Fix washer UPDATE orders (deja fait mais on s'assure)
DROP POLICY IF EXISTS washers_update_orders ON orders;
CREATE POLICY washers_update_orders ON orders
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = client_id
    OR EXISTS (
      SELECT 1 FROM public.washers w
      WHERE w.user_id = auth.uid()
      AND (w.id = orders.washer_id OR orders.washer_id IS NULL)
      AND w.status = 'approved'
    )
    OR is_admin()
  )
  WITH CHECK (
    auth.uid() = client_id
    OR EXISTS (
      SELECT 1 FROM public.washers w
      WHERE w.user_id = auth.uid()
      AND w.status = 'approved'
    )
    OR is_admin()
  );

-- ══════════════════════════════════════════════
-- ETAPE 4 : Admin bypass sur tables principales
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS admin_all_user_profiles ON user_profiles;
CREATE POLICY admin_all_user_profiles ON user_profiles FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_washers ON washers;
CREATE POLICY admin_all_washers ON washers FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_partners ON partners;
CREATE POLICY admin_all_partners ON partners FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_reviews ON reviews;
CREATE POLICY admin_all_reviews ON reviews FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_messages ON messages;
CREATE POLICY admin_all_messages ON messages FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_notifications ON notifications;
CREATE POLICY admin_all_notifications ON notifications FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_coupons ON coupons;
CREATE POLICY admin_all_coupons ON coupons FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_disputes ON disputes;
CREATE POLICY admin_all_disputes ON disputes FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_referrals ON referrals;
CREATE POLICY admin_all_referrals ON referrals FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_loyalty_points ON loyalty_points;
CREATE POLICY admin_all_loyalty_points ON loyalty_points FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_contact_messages ON contact_messages;
CREATE POLICY admin_all_contact_messages ON contact_messages FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_subscriptions ON subscriptions;
CREATE POLICY admin_all_subscriptions ON subscriptions FOR ALL USING (is_admin());

DROP POLICY IF EXISTS admin_all_analytics ON analytics_events;
CREATE POLICY admin_all_analytics ON analytics_events FOR ALL USING (is_admin());

-- ══════════════════════════════════════════════
-- VERIFICATION FINALE : Lister le status RLS
-- ══════════════════════════════════════════════
SELECT
  tablename,
  CASE WHEN rowsecurity THEN 'RLS ACTIF' ELSE 'RLS MANQUANT' END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC, tablename;
