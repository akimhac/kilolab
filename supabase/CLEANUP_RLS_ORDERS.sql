-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - NETTOYAGE COMPLET DES POLICIES ORDERS
-- Exécutez dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ÉTAPE 1 : SUPPRIMER TOUTES les anciennes policies sur orders
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS client_reads_orders ON orders;
DROP POLICY IF EXISTS washer_reads_orders ON orders;
DROP POLICY IF EXISTS washer_can_update_assigned_orders ON orders;
DROP POLICY IF EXISTS "washer_can_accept_mission" ON orders;
DROP POLICY IF EXISTS "washer_can_update_own_missions" ON orders;
DROP POLICY IF EXISTS "washer_sees_available_orders" ON orders;
DROP POLICY IF EXISTS "washer_sees_own_missions" ON orders;
DROP POLICY IF EXISTS clients_view_own_orders ON orders;
DROP POLICY IF EXISTS washers_view_available_orders ON orders;
DROP POLICY IF EXISTS washers_view_own_orders ON orders;
DROP POLICY IF EXISTS washers_update_orders ON orders;
DROP POLICY IF EXISTS admins_full_access_orders ON orders;
DROP POLICY IF EXISTS client_can_create_orders ON orders;
DROP POLICY IF EXISTS clients_create_orders ON orders;

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 2 : RECRÉER DES POLICIES PROPRES
-- ═══════════════════════════════════════════════════════════════════════════

-- A. ADMIN : Accès TOTAL (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY admins_full_access_orders ON orders
FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

-- B. CLIENT : Voir SES propres commandes (⚠️ C'EST CELLE QUI MANQUAIT !)
CREATE POLICY clients_view_own_orders ON orders
FOR SELECT TO authenticated
USING (auth.uid() = client_id);

-- C. CLIENT : Créer des commandes
CREATE POLICY clients_create_orders ON orders
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

-- D. WASHER : Voir les commandes disponibles (pending/confirmed/paid, sans washer)
CREATE POLICY washers_view_available_orders ON orders
FOR SELECT TO authenticated
USING (
  washer_id IS NULL
  AND status IN ('pending', 'confirmed', 'paid')
  AND EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND w.status = 'approved'
  )
);

-- E. WASHER : Voir ses propres commandes assignées
CREATE POLICY washers_view_own_orders ON orders
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND w.id = orders.washer_id
  )
);

-- F. WASHER : Mettre à jour les commandes (accepter + changer statut)
CREATE POLICY washers_update_orders ON orders
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND (w.id = orders.washer_id OR orders.washer_id IS NULL)
    AND w.status = 'approved'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.washers w
    WHERE w.user_id = auth.uid()
    AND w.status = 'approved'
  )
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ÉTAPE 3 : VÉRIFICATION
-- ═══════════════════════════════════════════════════════════════════════════
SELECT policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;
