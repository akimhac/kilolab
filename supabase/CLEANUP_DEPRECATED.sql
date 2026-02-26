-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - NETTOYAGE TABLES DEPRECATED
-- ⚠️ ATTENTION: Vérifier les données avant suppression
-- Exécuter dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1️⃣ VÉRIFIER LE CONTENU DES TABLES DEPRECATED AVANT SUPPRESSION
-- ═══════════════════════════════════════════════════════════════════════════

-- Compter les enregistrements dans chaque table deprecated
SELECT 'messages_deprecated' as table_name, COUNT(*) as row_count FROM messages_deprecated
UNION ALL
SELECT 'newsletter_subscribers_deprecated', COUNT(*) FROM newsletter_subscribers_deprecated
UNION ALL
SELECT 'order_photos_deprecated', COUNT(*) FROM order_photos_deprecated
UNION ALL
SELECT 'partner_time_slots_deprecated', COUNT(*) FROM partner_time_slots_deprecated
UNION ALL
SELECT 'push_subscriptions_deprecated', COUNT(*) FROM push_subscriptions_deprecated
UNION ALL
SELECT 'referral_usage_deprecated', COUNT(*) FROM referral_usage_deprecated
UNION ALL
SELECT 'support_responses_deprecated', COUNT(*) FROM support_responses_deprecated;

-- 2️⃣ BACKUP DES DONNÉES AVANT SUPPRESSION (OPTIONNEL)
-- ═══════════════════════════════════════════════════════════════════════════

-- Si tu veux garder une copie, exécute ces exports vers des tables d'archive
-- CREATE TABLE archive_messages AS SELECT * FROM messages_deprecated;
-- CREATE TABLE archive_newsletter AS SELECT * FROM newsletter_subscribers_deprecated;
-- etc.

-- 3️⃣ SUPPRESSION DES TABLES DEPRECATED (À DÉCOMMENTER POUR EXÉCUTER)
-- ═══════════════════════════════════════════════════════════════════════════

-- ⚠️ ATTENTION: Ces commandes sont irréversibles!
-- Décommente seulement si tu as vérifié que les données ne sont plus nécessaires

-- DROP TABLE IF EXISTS messages_deprecated;
-- DROP TABLE IF EXISTS newsletter_subscribers_deprecated;
-- DROP TABLE IF EXISTS order_photos_deprecated;
-- DROP TABLE IF EXISTS partner_time_slots_deprecated;
-- DROP TABLE IF EXISTS push_subscriptions_deprecated;
-- DROP TABLE IF EXISTS referral_usage_deprecated;
-- DROP TABLE IF EXISTS support_responses_deprecated;

-- 4️⃣ OPTIMISATION DES INDEX
-- ═══════════════════════════════════════════════════════════════════════════

-- Analyser les tables pour optimiser les statistiques de planification
ANALYZE orders;
ANALYZE user_profiles;
ANALYZE washers;
ANALYZE partners;
ANALYZE reviews;
ANALYZE messages;
ANALYZE notifications;

-- 5️⃣ VACUUM POUR RÉCUPÉRER L'ESPACE DISQUE (automatique sur Supabase)
-- ═══════════════════════════════════════════════════════════════════════════

-- VACUUM ANALYZE; -- Supabase gère automatiquement le vacuum

-- 6️⃣ STATISTIQUES FINALES
-- ═══════════════════════════════════════════════════════════════════════════

-- Taille des tables principales
SELECT 
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size,
  pg_size_pretty(pg_relation_size(relid)) as data_size,
  pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size
FROM pg_catalog.pg_statio_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 20;
