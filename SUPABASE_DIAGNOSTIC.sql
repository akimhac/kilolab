-- ═══════════════════════════════════════════════════════════════
-- KILOLAB - DIAGNOSTIC COMPLET SUPABASE
-- Copie ce script dans Supabase SQL Editor et exécute-le
-- ═══════════════════════════════════════════════════════════════

-- 1️⃣ LISTER TOUTES LES TABLES
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as nb_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2️⃣ COMPTER LES DONNÉES PAR TABLE
DO $$
DECLARE
  r RECORD;
  cnt INTEGER;
BEGIN
  RAISE NOTICE '═══ COMPTAGE DES DONNÉES ═══';
  FOR r IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I', r.table_name) INTO cnt;
    RAISE NOTICE '% : % lignes', r.table_name, cnt;
  END LOOP;
END $$;

-- 3️⃣ VÉRIFIER SI RLS EST ACTIVÉ
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS ACTIVÉ' ELSE '❌ RLS DÉSACTIVÉ' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 4️⃣ LISTER TOUTES LES POLICIES RLS
SELECT 
  tablename,
  policyname,
  cmd as operation,
  permissive
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5️⃣ STRUCTURE DES TABLES PRINCIPALES
-- user_profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- orders
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- partners
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'partners'
ORDER BY ordinal_position;

-- 6️⃣ VÉRIFIER LES FOREIGN KEYS
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- 7️⃣ VÉRIFIER LES TRIGGERS
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- 8️⃣ VÉRIFIER LES FONCTIONS
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 9️⃣ STATISTIQUES UTILISATEURS
SELECT 
  role,
  COUNT(*) as count
FROM user_profiles
GROUP BY role
ORDER BY count DESC;

-- 🔟 STATISTIQUES COMMANDES
SELECT 
  status,
  COUNT(*) as count,
  COALESCE(SUM(total_price), 0) as total_revenue
FROM orders
GROUP BY status
ORDER BY count DESC;

-- 1️⃣1️⃣ PARTENAIRES ACTIFS
SELECT 
  CASE WHEN is_active THEN 'Actifs' ELSE 'Inactifs' END as statut,
  COUNT(*) as count
FROM partners
GROUP BY is_active;

-- 1️⃣2️⃣ VÉRIFIER LES INDEX
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
