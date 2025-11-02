-- =====================================================
-- Migration: Normalisation de user_profiles
-- Description: Ajoute user_id pour lier auth.users et user_profiles
-- =====================================================

-- 1. Ajouter la colonne user_id si elle n'existe pas
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2. Backfill user_id depuis auth.users en matchant par email
UPDATE user_profiles p
SET user_id = u.id
FROM auth.users u
WHERE lower(u.email) = lower(p.email)
  AND p.user_id IS NULL;

-- 3. Ajouter la contrainte de clé étrangère
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_profiles_user_id_fk'
  ) THEN
    ALTER TABLE user_profiles
    ADD CONSTRAINT user_profiles_user_id_fk
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Créer un index unique sur user_id
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_key
ON user_profiles(user_id);

-- 5. Créer un index sur email pour les lookups rapides
CREATE INDEX IF NOT EXISTS user_profiles_email_idx
ON user_profiles(lower(email));

-- 6. Fonction trigger pour créer automatiquement un profil client lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, user_id, email, role, created_at)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    'client',
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 7. Trigger sur auth.users pour auto-créer les profils
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Vérification des données
DO $$
DECLARE
  orphan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphan_count
  FROM user_profiles
  WHERE user_id IS NULL;

  IF orphan_count > 0 THEN
    RAISE WARNING '⚠️  % profils sans user_id trouvés. Vérifiez que les emails matchent avec auth.users', orphan_count;
  ELSE
    RAISE NOTICE '✅ Tous les profils ont un user_id valide';
  END IF;
END $$;

-- =====================================================
-- Notes d'utilisation
-- =====================================================
-- Pour exécuter cette migration :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Collez et exécutez ce script
--
-- Pour vérifier le résultat :
-- SELECT email, role, user_id FROM user_profiles;
-- =====================================================
