-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - SCRIPT RLS OPTIMISÉ
-- Exécute ce script dans Supabase SQL Editor
-- Objectif : Sécuriser toutes les tables sans bloquer les actions légitimes
-- ═══════════════════════════════════════════════════════════════════════════

-- 1️⃣ ACTIVER RLS SUR TOUTES LES TABLES PRINCIPALES
-- ═══════════════════════════════════════════════════════════════════════════

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

-- 2️⃣ POLICIES POUR USER_PROFILES
-- ═══════════════════════════════════════════════════════════════════════════

-- Supprimer anciennes policies si existantes
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins full access" ON user_profiles;
DROP POLICY IF EXISTS "Service role bypass" ON user_profiles;

-- Lecture : utilisateur peut voir son propre profil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Mise à jour : utilisateur peut modifier son propre profil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insertion : trigger gère la création automatique via auth
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins : accès complet via service role (pour dashboard admin)
-- Note: Les admins utilisent le service_role key, pas l'anon key

-- 3️⃣ POLICIES POUR ORDERS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Clients can view own orders" ON orders;
DROP POLICY IF EXISTS "Clients can create orders" ON orders;
DROP POLICY IF EXISTS "Washers can view assigned orders" ON orders;
DROP POLICY IF EXISTS "Washers can update assigned orders" ON orders;
DROP POLICY IF EXISTS "Partners can view partner orders" ON orders;

-- Clients voient leurs commandes
CREATE POLICY "Clients can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = client_id OR
    auth.uid() = washer_id OR
    auth.uid() IN (SELECT user_id FROM partners WHERE id = orders.partner_id)
  );

-- Clients peuvent créer des commandes
CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Washers peuvent mettre à jour leurs commandes assignées
CREATE POLICY "Washers can update assigned orders" ON orders
  FOR UPDATE USING (auth.uid() = washer_id);

-- 4️⃣ POLICIES POUR WASHERS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public can view approved washers" ON washers;
DROP POLICY IF EXISTS "Washers can view own profile" ON washers;
DROP POLICY IF EXISTS "Anyone can apply as washer" ON washers;
DROP POLICY IF EXISTS "Washers can update own profile" ON washers;

-- Public peut voir les washers approuvés (pour recherche)
CREATE POLICY "Public can view approved washers" ON washers
  FOR SELECT USING (status = 'approved');

-- Washer peut voir son propre profil même si pas approuvé
CREATE POLICY "Washers can view own profile" ON washers
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

-- N'importe qui peut postuler comme washer
CREATE POLICY "Anyone can apply as washer" ON washers
  FOR INSERT WITH CHECK (true);

-- Washer peut mettre à jour son propre profil
CREATE POLICY "Washers can update own profile" ON washers
  FOR UPDATE USING (auth.uid() = user_id);

-- 5️⃣ POLICIES POUR PARTNERS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public can view active partners" ON partners;
DROP POLICY IF EXISTS "Partners can view own profile" ON partners;
DROP POLICY IF EXISTS "Anyone can apply as partner" ON partners;
DROP POLICY IF EXISTS "Partners can update own profile" ON partners;

-- Public peut voir les partenaires actifs
CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (is_active = true);

-- Partner peut voir son propre profil
CREATE POLICY "Partners can view own profile" ON partners
  FOR SELECT USING (auth.uid() = user_id);

-- N'importe qui peut postuler comme partenaire
CREATE POLICY "Anyone can apply as partner" ON partners
  FOR INSERT WITH CHECK (true);

-- Partner peut mettre à jour son propre profil
CREATE POLICY "Partners can update own profile" ON partners
  FOR UPDATE USING (auth.uid() = user_id);

-- 6️⃣ POLICIES POUR REVIEWS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public can view public reviews" ON reviews;
DROP POLICY IF EXISTS "Clients can create reviews" ON reviews;
DROP POLICY IF EXISTS "Clients can update own reviews" ON reviews;

-- Public peut voir les avis publics
CREATE POLICY "Public can view public reviews" ON reviews
  FOR SELECT USING (is_public = true);

-- Clients peuvent créer des avis sur leurs commandes
CREATE POLICY "Clients can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.client_id = auth.uid())
  );

-- Clients peuvent modifier leurs propres avis
CREATE POLICY "Clients can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = client_id);

-- 7️⃣ POLICIES POUR MESSAGES
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON messages;

-- Utilisateurs peuvent voir les messages où ils sont expéditeur ou destinataire
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Utilisateurs peuvent envoyer des messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Utilisateurs peuvent marquer les messages comme lus
CREATE POLICY "Users can mark messages as read" ON messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- 8️⃣ POLICIES POUR NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Utilisateurs voient leurs propres notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Utilisateurs peuvent marquer leurs notifications comme lues
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 9️⃣ POLICIES POUR COUPONS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Users can view own coupons" ON coupons;

-- Public peut voir les coupons actifs (pour validation côté client)
CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Utilisateurs peuvent voir leurs coupons personnalisés
CREATE POLICY "Users can view own coupons" ON coupons
  FOR SELECT USING (user_id = auth.uid());

-- 🔟 POLICIES POUR DISPUTES
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can view own disputes" ON disputes;
DROP POLICY IF EXISTS "Users can create disputes" ON disputes;

-- Utilisateurs peuvent voir leurs litiges
CREATE POLICY "Users can view own disputes" ON disputes
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = washer_id);

-- Clients peuvent créer des litiges sur leurs commandes
CREATE POLICY "Users can create disputes" ON disputes
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.client_id = auth.uid())
  );

-- 1️⃣1️⃣ POLICIES POUR REFERRALS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can create referrals" ON referrals;

-- Utilisateurs peuvent voir leurs parrainages
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Utilisateurs peuvent créer des parrainages
CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- 1️⃣2️⃣ POLICIES POUR LOYALTY_POINTS
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;

-- Utilisateurs peuvent voir leurs points de fidélité
CREATE POLICY "Users can view own loyalty points" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- 1️⃣3️⃣ TABLES PUBLIQUES (Pas de RLS nécessaire)
-- ═══════════════════════════════════════════════════════════════════════════
-- Ces tables sont accessibles publiquement ou gérées par le backend

-- contact_messages : Les messages de contact sont créés sans auth
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit contact message" ON contact_messages;
CREATE POLICY "Anyone can submit contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- 1️⃣4️⃣ FONCTION HELPER POUR VÉRIFIER LE ROLE ADMIN
-- ═══════════════════════════════════════════════════════════════════════════

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
-- FIN DU SCRIPT - VÉRIFICATION
-- ═══════════════════════════════════════════════════════════════════════════

-- Vérifier que RLS est activé
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS ACTIVÉ' ELSE '❌ RLS DÉSACTIVÉ' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'washers', 'partners', 'reviews', 'messages', 'notifications', 'coupons', 'disputes', 'referrals', 'loyalty_points', 'contact_messages')
ORDER BY tablename;

-- Lister les policies créées
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
