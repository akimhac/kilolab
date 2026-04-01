-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - COMPLEMENT RLS (VERSION SAFE)
-- Utilise DROP IF EXISTS pour eviter les erreurs de duplication
-- Executer APRES le fichier RLS_POLICIES_SAFE.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. FIX CRITIQUE : Washers peuvent voir les commandes DISPONIBLES
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS washers_view_available_orders ON orders;
CREATE POLICY washers_view_available_orders
ON public.orders
FOR SELECT
TO authenticated
USING (
  washer_id IS NULL
  AND partner_id IS NULL
  AND status IN ('pending', 'confirmed', 'paid')
  AND EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND w.status = 'approved'
  )
);

-- 2. FIX : Washers peuvent s'auto-assigner une commande disponible
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS washers_update_orders ON orders;
CREATE POLICY washers_update_orders
ON public.orders
FOR UPDATE
TO authenticated
USING (
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

-- 3. ADMIN : Acces complet aux orders
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS admins_full_access_orders ON orders;
CREATE POLICY admins_full_access_orders
ON public.orders
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 4. ADMIN : Acces complet aux autres tables critiques
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS admins_full_access_user_profiles ON user_profiles;
CREATE POLICY admins_full_access_user_profiles
ON public.user_profiles
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_washers ON washers;
CREATE POLICY admins_full_access_washers
ON public.washers
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_partners ON partners;
CREATE POLICY admins_full_access_partners
ON public.partners
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_reviews ON reviews;
CREATE POLICY admins_full_access_reviews
ON public.reviews
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_coupons ON coupons;
CREATE POLICY admins_full_access_coupons
ON public.coupons
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_disputes ON disputes;
CREATE POLICY admins_full_access_disputes
ON public.disputes
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 5. REFERRAL_CODES : Policies si la table existe
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referral_codes') THEN
    EXECUTE 'ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'DROP POLICY IF EXISTS users_view_own_referral_code ON referral_codes';
    EXECUTE 'CREATE POLICY users_view_own_referral_code ON referral_codes FOR SELECT USING (auth.uid() = user_id)';
    
    EXECUTE 'DROP POLICY IF EXISTS users_create_referral_code ON referral_codes';
    EXECUTE 'CREATE POLICY users_create_referral_code ON referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id)';
    
    EXECUTE 'DROP POLICY IF EXISTS anyone_validate_referral_code ON referral_codes';
    EXECUTE 'CREATE POLICY anyone_validate_referral_code ON referral_codes FOR SELECT USING (is_active = true)';
    
    RAISE NOTICE 'Policies created for referral_codes table';
  ELSE
    RAISE NOTICE 'Table referral_codes does not exist, skipping...';
  END IF;
END $$;

-- 6. NOTIFICATIONS : Permettre au systeme de creer des notifications
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS service_create_notifications ON notifications;
CREATE POLICY service_create_notifications
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 7. VERIFICATION FINALE
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
AND tablename IN ('orders', 'washers', 'partners', 'user_profiles', 'coupons', 'referral_codes')
ORDER BY tablename, policyname;
