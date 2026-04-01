-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - FIX RLS + ADMIN FULL RIGHTS
-- Exécutez ce script dans Supabase SQL Editor
-- Date: 01/04/2026
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. FIX CRITIQUE : Washers voient aussi les commandes "paid"
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

-- 2. FIX : Washers peuvent s'auto-assigner ET mettre à jour leurs commandes
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS washers_update_orders ON orders;
CREATE POLICY washers_update_orders
ON public.orders
FOR UPDATE
TO authenticated
USING (
  auth.uid() = client_id
  OR EXISTS (
    SELECT 1 FROM public.washers w 
    WHERE w.user_id = auth.uid() 
    AND (w.id = orders.washer_id OR orders.washer_id IS NULL)
    AND w.status = 'approved'
  )
)
WITH CHECK (
  auth.uid() = client_id
  OR EXISTS (
    SELECT 1 FROM public.washers w 
    WHERE w.user_id = auth.uid() 
    AND w.status = 'approved'
  )
);

-- 3. Washers voient AUSSI leurs propres commandes assignées
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS washers_view_own_orders ON orders;
CREATE POLICY washers_view_own_orders
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND w.id = orders.washer_id
  )
);

-- 4. ADMIN : Fonction is_admin() (créer si n'existe pas)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND (role = 'admin' OR email IN ('akim.hachili@gmail.com'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ADMIN : Accès TOTAL sur orders (SELECT, INSERT, UPDATE, DELETE)
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS admins_full_access_orders ON orders;
CREATE POLICY admins_full_access_orders
ON public.orders
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 6. ADMIN : Accès TOTAL sur washers
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS admins_full_access_washers ON washers;
CREATE POLICY admins_full_access_washers
ON public.washers
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 7. ADMIN : Accès TOTAL sur user_profiles
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS admins_full_access_user_profiles ON user_profiles;
CREATE POLICY admins_full_access_user_profiles
ON public.user_profiles
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 8. ADMIN : Accès TOTAL sur partners
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS admins_full_access_partners ON partners;
CREATE POLICY admins_full_access_partners
ON public.partners
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 9. ADMIN : Accès TOTAL sur reviews, coupons, disputes, notifications
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS admins_full_access_reviews ON reviews;
CREATE POLICY admins_full_access_reviews
ON public.reviews FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_coupons ON coupons;
CREATE POLICY admins_full_access_coupons
ON public.coupons FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_disputes ON disputes;
CREATE POLICY admins_full_access_disputes
ON public.disputes FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_notifications ON notifications;
CREATE POLICY admins_full_access_notifications
ON public.notifications FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS admins_full_access_messages ON messages;
CREATE POLICY admins_full_access_messages
ON public.messages FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

-- 10. VÉRIFIER que votre compte admin a le role 'admin'
-- ═══════════════════════════════════════════════════════════════════════════
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'akim.hachili@gmail.com' 
AND (role IS NULL OR role != 'admin');

-- 11. VÉRIFICATION FINALE : Afficher toutes les policies sur orders
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;
