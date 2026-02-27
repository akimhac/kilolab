-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - SCRIPT RLS PRINCIPAL (VERSION SAFE)
-- Utilise DROP IF EXISTS pour eviter les erreurs de duplication
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. ACTIVER RLS SUR TOUTES LES TABLES PRINCIPALES
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

-- 2. SUPPRIMER TOUTES LES ANCIENNES POLICIES
DROP POLICY IF EXISTS users_view_own_profile ON user_profiles;
DROP POLICY IF EXISTS users_update_own_profile ON user_profiles;
DROP POLICY IF EXISTS users_insert_own_profile ON user_profiles;
DROP POLICY IF EXISTS clients_view_own_orders ON orders;
DROP POLICY IF EXISTS clients_create_orders ON orders;
DROP POLICY IF EXISTS washers_update_orders ON orders;
DROP POLICY IF EXISTS public_view_approved_washers ON washers;
DROP POLICY IF EXISTS washers_view_own_profile ON washers;
DROP POLICY IF EXISTS anyone_apply_washer ON washers;
DROP POLICY IF EXISTS washers_update_own_profile ON washers;
DROP POLICY IF EXISTS public_view_active_partners ON partners;
DROP POLICY IF EXISTS partners_view_own_profile ON partners;
DROP POLICY IF EXISTS anyone_apply_partner ON partners;
DROP POLICY IF EXISTS partners_update_own_profile ON partners;
DROP POLICY IF EXISTS public_view_public_reviews ON reviews;
DROP POLICY IF EXISTS clients_create_reviews ON reviews;
DROP POLICY IF EXISTS clients_update_own_reviews ON reviews;
DROP POLICY IF EXISTS users_view_own_messages ON messages;
DROP POLICY IF EXISTS users_send_messages ON messages;
DROP POLICY IF EXISTS users_mark_messages_read ON messages;
DROP POLICY IF EXISTS users_view_own_notifications ON notifications;
DROP POLICY IF EXISTS users_update_own_notifications ON notifications;
DROP POLICY IF EXISTS public_view_active_coupons ON coupons;
DROP POLICY IF EXISTS users_view_own_coupons ON coupons;
DROP POLICY IF EXISTS users_view_own_disputes ON disputes;
DROP POLICY IF EXISTS users_create_disputes ON disputes;
DROP POLICY IF EXISTS users_view_own_referrals ON referrals;
DROP POLICY IF EXISTS users_create_referrals ON referrals;
DROP POLICY IF EXISTS users_view_own_loyalty_points ON loyalty_points;
DROP POLICY IF EXISTS anyone_submit_contact ON contact_messages;

-- 3. POLICIES POUR USER_PROFILES
CREATE POLICY users_view_own_profile ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own_profile ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY users_insert_own_profile ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. POLICIES POUR ORDERS
CREATE POLICY clients_view_own_orders ON orders
  FOR SELECT USING (
    auth.uid() = client_id OR
    auth.uid() = washer_id OR
    auth.uid() IN (SELECT user_id FROM partners WHERE id = orders.partner_id)
  );

CREATE POLICY clients_create_orders ON orders
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY washers_update_orders ON orders
  FOR UPDATE USING (auth.uid() = washer_id OR auth.uid() = client_id);

-- 5. POLICIES POUR WASHERS
CREATE POLICY public_view_approved_washers ON washers
  FOR SELECT USING (status = 'approved');

CREATE POLICY washers_view_own_profile ON washers
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY anyone_apply_washer ON washers
  FOR INSERT WITH CHECK (true);

CREATE POLICY washers_update_own_profile ON washers
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. POLICIES POUR PARTNERS
CREATE POLICY public_view_active_partners ON partners
  FOR SELECT USING (is_active = true);

CREATE POLICY partners_view_own_profile ON partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY anyone_apply_partner ON partners
  FOR INSERT WITH CHECK (true);

CREATE POLICY partners_update_own_profile ON partners
  FOR UPDATE USING (auth.uid() = user_id);

-- 7. POLICIES POUR REVIEWS
CREATE POLICY public_view_public_reviews ON reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY clients_create_reviews ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.client_id = auth.uid())
  );

CREATE POLICY clients_update_own_reviews ON reviews
  FOR UPDATE USING (auth.uid() = client_id);

-- 8. POLICIES POUR MESSAGES
CREATE POLICY users_view_own_messages ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY users_send_messages ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY users_mark_messages_read ON messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- 9. POLICIES POUR NOTIFICATIONS
CREATE POLICY users_view_own_notifications ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY users_update_own_notifications ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 10. POLICIES POUR COUPONS
CREATE POLICY public_view_active_coupons ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY users_view_own_coupons ON coupons
  FOR SELECT USING (user_id = auth.uid());

-- 11. POLICIES POUR DISPUTES
CREATE POLICY users_view_own_disputes ON disputes
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = washer_id);

CREATE POLICY users_create_disputes ON disputes
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.client_id = auth.uid())
  );

-- 12. POLICIES POUR REFERRALS
CREATE POLICY users_view_own_referrals ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY users_create_referrals ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- 13. POLICIES POUR LOYALTY_POINTS
CREATE POLICY users_view_own_loyalty_points ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- 14. POLICIES POUR CONTACT_MESSAGES (public)
CREATE POLICY anyone_submit_contact ON contact_messages
  FOR INSERT WITH CHECK (true);

-- 15. FONCTION HELPER ADMIN (recree si existe)
DROP FUNCTION IF EXISTS is_admin();
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- VERIFICATION FINALE
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'RLS ACTIVE' ELSE 'RLS INACTIVE' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'washers', 'partners', 'reviews', 'messages', 'notifications', 'coupons', 'disputes', 'referrals', 'loyalty_points', 'contact_messages')
ORDER BY tablename;
