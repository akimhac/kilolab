═══════════════════════════════════════════════════════════════
KILOLAB - ANALYSE BASE DE DONNÉES
═══════════════════════════════════════════════════════════════

🔍 PROBLÈME IDENTIFIÉ :

Tu as mentionné 2 tables qui semblent redondantes :
- `profiles` (probablement créée par défaut Supabase)
- `user_profiles` (celle que tu utilises vraiment)

═══════════════════════════════════════════════════════════════
📊 ÉTAPE 1 : ANALYSE
═══════════════════════════════════════════════════════════════

Va sur Supabase Dashboard et exécute ces requêtes pour analyer :
```sql
-- 1. Voir la structure de "profiles"
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Voir la structure de "user_profiles"
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 3. Compter les données dans "profiles"
SELECT COUNT(*) as total_profiles FROM profiles;

-- 4. Compter les données dans "user_profiles"
SELECT COUNT(*) as total_user_profiles FROM user_profiles;

-- 5. Voir quelques exemples de "profiles"
SELECT * FROM profiles LIMIT 5;

-- 6. Voir quelques exemples de "user_profiles"
SELECT * FROM user_profiles LIMIT 5;
```

═══════════════════════════════════════════════════════════════
🎯 ÉTAPE 2 : DÉCISION
═══════════════════════════════════════════════════════════════

SCÉNARIO A : "profiles" est vide ou inutilisée
→ Solution : Supprimer la table "profiles"

SCÉNARIO B : "profiles" contient des données importantes
→ Solution : Migrer les données vers "user_profiles"

SCÉNARIO C : Les deux tables ont des données différentes
→ Solution : Fusionner intelligemment

═══════════════════════════════════════════════════════════════
🔧 ÉTAPE 3 : SCRIPTS DE NETTOYAGE
═══════════════════════════════════════════════════════════════

--- SCRIPT A : Supprimer "profiles" (si vide) ---
```sql
-- Vérifier d'abord qu'elle est vide
SELECT COUNT(*) FROM profiles;

-- Si COUNT = 0, supprimer :
DROP TABLE IF EXISTS profiles CASCADE;
```

--- SCRIPT B : Migrer "profiles" vers "user_profiles" ---
```sql
-- 1. Vérifier les colonnes communes
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
INTERSECT
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'user_profiles';

-- 2. Migrer les données (adapter selon tes colonnes)
INSERT INTO user_profiles (id, email, full_name, phone, role, created_at)
SELECT id, email, full_name, phone, 'client' as role, created_at
FROM profiles
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier la migration
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles_count,
  (SELECT COUNT(*) FROM user_profiles) as user_profiles_count;

-- 4. Si tout est OK, supprimer "profiles"
DROP TABLE IF EXISTS profiles CASCADE;
```

--- SCRIPT C : Standardiser user_profiles ---
```sql
-- S'assurer que user_profiles a bien les bonnes colonnes

-- Vérifier la structure actuelle
\d user_profiles

-- Ajouter des colonnes manquantes si nécessaire
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT FALSE;

-- Créer un index sur le role pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Créer un index sur l'email
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
```

═══════════════════════════════════════════════════════════════
🔒 ÉTAPE 4 : ROW LEVEL SECURITY (RLS)
═══════════════════════════════════════════════════════════════

Assure-toi que user_profiles a les bonnes policies RLS :
```sql
-- Activer RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Policy : Les utilisateurs peuvent mettre à jour leur profil
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy : Les admins peuvent tout voir
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy : Insertion lors du signup
CREATE POLICY "Enable insert for signup"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

═══════════════════════════════════════════════════════════════
✅ ÉTAPE 5 : VÉRIFICATION FINALE
═══════════════════════════════════════════════════════════════

Après nettoyage, teste ces requêtes :
```sql
-- 1. Vérifier qu'il n'y a plus de table "profiles"
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'profiles';
-- Résultat attendu : 0 lignes

-- 2. Vérifier user_profiles
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN role = 'client' THEN 1 END) as clients,
  COUNT(CASE WHEN role = 'partner' THEN 1 END) as partners,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
FROM user_profiles;

-- 3. Vérifier les RLS policies
SELECT policyname, tablename, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';

-- 4. Tester une requête comme dans l'admin dashboard
SELECT *
FROM user_profiles
WHERE role = 'client'
ORDER BY created_at DESC
LIMIT 10;
```

═══════════════════════════════════════════════════════════════
📋 CHECKLIST FINALE
═══════════════════════════════════════════════════════════════

[ ] Analyser "profiles" et "user_profiles"
[ ] Décider de la stratégie (supprimer ou migrer)
[ ] Exécuter le script de nettoyage
[ ] Vérifier que user_profiles a les bonnes colonnes
[ ] Configurer les RLS policies
[ ] Tester les requêtes dans l'admin dashboard
[ ] Vérifier que les clients apparaissent bien
[ ] Backup de la BDD avant toute modification critique

═══════════════════════════════════════════════════════════════
⚠️  IMPORTANT - BACKUP
═══════════════════════════════════════════════════════════════

AVANT de supprimer quoi que ce soit :

1. Va sur Supabase Dashboard
2. Settings → Database → Backups
3. Crée un backup manuel
4. Télécharge-le localement

OU exporte via SQL :
```bash
# Si tu as accès à la ligne de commande
pg_dump -h your-host -U postgres -d your-db > backup_kilolab_$(date +%Y%m%d).sql
```

═══════════════════════════════════════════════════════════════
🆘 EN CAS DE PROBLÈME
═══════════════════════════════════════════════════════════════

Si tu as supprimé "profiles" et ça casse :

1. Restaure le backup
2. Contacte le support Supabase
3. Envoie-moi le message d'erreur exact

═══════════════════════════════════════════════════════════════
