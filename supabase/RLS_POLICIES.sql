-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - SCRIPT RLS OPTIMISÉ (VERSION CORRIGÉE)
-- Exécute ce script dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1️⃣ ACTIVER RLS SUR TOUTES LES TABLES PRINCIPALES
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE washers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 2️⃣ SUPPRIMER ANCIENNES POLICIES (si existantes)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Clients can view own orders" ON orders;
DROP POLICY IF EXISTS "Clients can create orders" ON orders;
DROP POLICY IF EXISTS "Washers can update assigned orders" ON orders;
DROP POLICY IF EXISTS "Public can view approved washers" ON washers;
DROP POLICY IF EXISTS "Washers can view own profile" ON washers;
DROP POLICY IF EXISTS "Anyone can apply as washer" ON washers;
DROP POLICY IF EXISTS "Washers can update own profile" ON washers;
DROP POLICY IF EXISTS "Public can view active partners" ON partners;
DROP POLICY IF EXISTS "Partners can view own profile" ON partners;
DROP POLICY IF EXISTS "Anyone can apply as partner" ON partners;
DROP POLICY IF EXISTS "Partners can update own profile" ON partners;
DROP POLICY IF EXISTS "Public can view public reviews" ON reviews;
DROP POLICY IF EXISTS "Clients can create reviews" ON reviews;
DROP POLICY IF EXISTS "Clients can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON messages;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Public can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Users can view own coupons" ON coupons;
DROP POLICY IF EXISTS "Users can view own disputes" ON disputes;
DROP POLICY IF EXISTS "Users can create disputes" ON disputes;
DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can create referrals" ON referrals;
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "Anyone can submit contact message" ON contact_messages;

-- 3️⃣ POLICIES POUR USER_PROFILES
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4️⃣ POLICIES POUR ORDERS
CREATE POLICY "Clients can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = client_id OR
    auth.uid() = washer_id OR
    auth.uid() IN (SELECT user_id FROM partners WHERE id = orders.partner_id)
  );

CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Washers can update assigned orders" ON orders
  FOR UPDATE USING (auth.uid() = washer_id OR auth.uid() = client_id);

-- 5️⃣ POLICIES POUR WASHERS
CREATE POLICY "Public can view approved washers" ON washers
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Washers can view own profile" ON washers
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Anyone can apply as washer" ON washers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Washers can update own profile" ON washers
  FOR UPDATE USING (auth.uid() = user_id);

-- 6️⃣ POLICIES POUR PARTNERS
CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Partners can view own profile" ON partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can apply as partner" ON partners
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Partners can update own profile" ON partners
  FOR UPDATE USING (auth.uid() = user_id);

-- 7️⃣ POLICIES POUR REVIEWS
CREATE POLICY "Public can view public reviews" ON reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "Clients can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.client_id = auth.uid())
  );

CREATE POLICY "Clients can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = client_id);

-- 8️⃣ POLICIES POUR MESSAGES
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read" ON messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- 9️⃣ POLICIES POUR NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 🔟 POLICIES POUR COUPONS
CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Users can view own coupons" ON coupons
  FOR SELECT USING (user_id = auth.uid());

-- 1️⃣1️⃣ POLICIES POUR DISPUTES
CREATE POLICY "Users can view own disputes" ON disputes
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = washer_id);

CREATE POLICY "Users can create disputes" ON disputes
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.client_id = auth.uid())
  );

-- 1️⃣2️⃣ POLICIES POUR REFERRALS
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- 1️⃣3️⃣ POLICIES POUR LOYALTY_POINTS
CREATE POLICY "Users can view own loyalty points" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- 1️⃣4️⃣ POLICIES POUR CONTACT_MESSAGES (public)
CREATE POLICY "Anyone can submit contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- 1️⃣5️⃣ FONCTION HELPER ADMIN
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION FINALE
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'RLS ACTIVE' ELSE 'RLS INACTIVE' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'washers', 'partners', 'reviews', 'messages', 'notifications', 'coupons', 'disputes', 'referrals', 'loyalty_points', 'contact_messages')
ORDER BY tablename;
