-- DIAGNOSTIC: Pourquoi les commandes ne s'affichent pas pour le client ?
-- Executez ce script dans Supabase SQL Editor

-- 1. Verifier les politiques RLS actives sur la table orders
SELECT policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'orders' 
ORDER BY policyname;

-- 2. Verifier qu'il y a bien une politique SELECT pour client_id
-- Resultat attendu: "clients_view_own_orders" avec "auth.uid() = client_id"
SELECT policyname, qual 
FROM pg_policies 
WHERE tablename = 'orders' AND cmd = 'SELECT';

-- 3. Compter les commandes du client test (remplacer l'ID)
-- Pour trouver l'ID: SELECT id, email FROM auth.users WHERE email = 'sousouait59600@gmail.com';
SELECT id, email FROM auth.users WHERE email = 'sousouait59600@gmail.com';

-- 4. Verifier les commandes directement (bypasse RLS car on est admin dans SQL Editor)
SELECT id, client_id, status, washer_id, created_at, total_price 
FROM orders 
WHERE client_id = (SELECT id FROM auth.users WHERE email = 'sousouait59600@gmail.com')
ORDER BY created_at DESC;

-- 5. Si la politique clients_view_own_orders n'existe PAS, la recreer:
-- DROP POLICY IF EXISTS clients_view_own_orders ON orders;
-- CREATE POLICY clients_view_own_orders ON orders
--   FOR SELECT USING (
--     auth.uid() = client_id OR
--     auth.uid() = washer_id OR
--     auth.uid() IN (SELECT user_id FROM partners WHERE id = orders.partner_id)
--   );

-- 6. Verifier que washers est accessible (necessaire pour le join)
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'washers' AND cmd = 'SELECT';
