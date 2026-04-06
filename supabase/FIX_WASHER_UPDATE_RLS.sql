-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - VERIFICATION ET FIX RLS ORDERS (06/04/2026)
-- Exécutez dans Supabase SQL Editor → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- ÉTAPE 1 : Vérifier les policies actuelles
SELECT policyname, cmd, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- ═══════════════════════════════════════════════════════════════════════════
-- Si la policy "washers_update_orders" N'EXISTE PAS ou est mal configurée,
-- exécutez la suite :
-- ═══════════════════════════════════════════════════════════════════════════

-- ÉTAPE 2 : Supprimer les anciennes policies washer sur orders
DROP POLICY IF EXISTS washer_can_update_assigned_orders ON orders;
DROP POLICY IF EXISTS "washer_can_accept_mission" ON orders;
DROP POLICY IF EXISTS "washer_can_update_own_missions" ON orders;
DROP POLICY IF EXISTS washers_update_orders ON orders;

-- ÉTAPE 3 : Recréer la policy washer UPDATE
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

-- ÉTAPE 4 : Vérifier le résultat
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'orders' AND policyname = 'washers_update_orders';
