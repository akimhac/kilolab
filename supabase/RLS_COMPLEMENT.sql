-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - COMPLÉMENT RLS (FIXES CRITIQUES)
-- Exécuter APRÈS le fichier RLS_POLICIES.sql principal
-- ═══════════════════════════════════════════════════════════════════════════

-- 1️⃣ FIX CRITIQUE : Washers peuvent voir les commandes DISPONIBLES
-- Sans cette policy, le WasherDashboard affiche 0 mission
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY washers_view_available_orders
ON public.orders
FOR SELECT
TO authenticated
USING (
  washer_id IS NULL
  AND partner_id IS NULL
  AND status IN ('pending', 'confirmed')
  AND EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND w.status = 'approved'
  )
);

-- 2️⃣ FIX : Washers peuvent s'auto-assigner une commande disponible
-- Permet le flow "acceptMission" dans WasherDashboard
-- ═══════════════════════════════════════════════════════════════════════════

-- D'abord supprimer l'ancienne policy si elle existe
DROP POLICY IF EXISTS washers_update_orders ON orders;

-- Recréer avec la logique complète
CREATE POLICY washers_update_orders
ON public.orders
FOR UPDATE
TO authenticated
USING (
  -- Soit le washer est déjà assigné
  auth.uid() = washer_id
  -- Soit le washer est le client
  OR auth.uid() = client_id
  -- Soit c'est une commande disponible et le user est un washer approuvé
  OR (
    washer_id IS NULL
    AND EXISTS (
      SELECT 1 FROM public.washers w 
      WHERE w.user_id = auth.uid() 
      AND w.status = 'approved'
    )
  )
)
WITH CHECK (
  auth.uid() = washer_id
  OR auth.uid() = client_id
  OR (
    washer_id IS NULL
    AND EXISTS (
      SELECT 1 FROM public.washers w 
      WHERE w.user_id = auth.uid() 
      AND w.status = 'approved'
    )
  )
);

-- 3️⃣ ADMIN : Accès complet aux orders pour le dashboard admin
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY admins_full_access_orders
ON public.orders
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 4️⃣ ADMIN : Accès complet aux autres tables critiques
-- ═══════════════════════════════════════════════════════════════════════════

-- Admin sur user_profiles
CREATE POLICY admins_full_access_user_profiles
ON public.user_profiles
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin sur washers
CREATE POLICY admins_full_access_washers
ON public.washers
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin sur partners
CREATE POLICY admins_full_access_partners
ON public.partners
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin sur reviews
CREATE POLICY admins_full_access_reviews
ON public.reviews
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin sur coupons (CRUD complet)
CREATE POLICY admins_full_access_coupons
ON public.coupons
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin sur disputes
CREATE POLICY admins_full_access_disputes
ON public.disputes
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 5️⃣ REFERRAL_CODES : Si la table existe
-- ═══════════════════════════════════════════════════════════════════════════

-- Vérifier si la table existe avant de créer les policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referral_codes') THEN
    -- Activer RLS
    EXECUTE 'ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY';
    
    -- Users peuvent voir leur propre code
    EXECUTE 'CREATE POLICY IF NOT EXISTS users_view_own_referral_code ON referral_codes FOR SELECT USING (auth.uid() = user_id)';
    
    -- Users peuvent créer leur code
    EXECUTE 'CREATE POLICY IF NOT EXISTS users_create_referral_code ON referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id)';
    
    -- Tout le monde peut valider un code (pour l'appliquer)
    EXECUTE 'CREATE POLICY IF NOT EXISTS anyone_validate_referral_code ON referral_codes FOR SELECT USING (is_active = true)';
    
    RAISE NOTICE 'Policies created for referral_codes table';
  ELSE
    RAISE NOTICE 'Table referral_codes does not exist, skipping...';
  END IF;
END $$;

-- 6️⃣ NOTIFICATIONS : Permettre au système de créer des notifications
-- ═══════════════════════════════════════════════════════════════════════════

-- Le service peut créer des notifications pour n'importe quel user
CREATE POLICY service_create_notifications
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 7️⃣ VÉRIFICATION FINALE
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('orders', 'washers', 'partners', 'user_profiles', 'coupons')
ORDER BY tablename, policyname;
