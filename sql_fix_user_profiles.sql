-- OPTIONNEL : si tu veux normaliser la base pour avoir aussi user_id
-- 1) Ajouter la colonne user_id
-- ALTER TABLE user_profiles ADD COLUMN user_id uuid;

-- 2) Renseigner user_id depuis auth.users par l'email
-- UPDATE user_profiles p
-- SET user_id = u.id
-- FROM auth.users u
-- WHERE lower(u.email) = lower(p.email);

-- 3) (Facultatif) Contraintes
-- ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_fk
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
-- CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_key ON user_profiles(user_id);
