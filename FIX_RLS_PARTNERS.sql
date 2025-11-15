-- ============================================
-- FIX RLS PARTNERS - AUTORISER LECTURE PUBLIQUE
-- ============================================

-- 1. DÉSACTIVER temporairement RLS pour tester
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;

-- 2. Si tu veux garder RLS activé, utilise plutôt:
-- ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- 3. SUPPRIMER toutes les policies existantes
DROP POLICY IF EXISTS "Public partners read access" ON partners;
DROP POLICY IF EXISTS "Allow public read partners" ON partners;
DROP POLICY IF EXISTS "Public can view active partners" ON partners;
DROP POLICY IF EXISTS "Enable read access for all users" ON partners;
DROP POLICY IF EXISTS "partners_select_policy" ON partners;

-- 4. CRÉER UNE POLICY PUBLIQUE (si RLS activé)
-- CREATE POLICY "Allow anonymous read"
-- ON partners
-- FOR SELECT
-- TO anon, authenticated
-- USING (true);

-- 5. VÉRIFIER l'état
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'partners';

-- 6. TEST DIRECT
SELECT COUNT(*) as total FROM partners;
SELECT COUNT(*) as active FROM partners WHERE is_active = true;
