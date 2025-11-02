# 🔑 Réinitialisation des mots de passe de test

## Problème
Le login échoue avec "Invalid login credentials" car les utilisateurs de test n'ont pas de mots de passe configurés dans Supabase Auth.

## Solution : Reset via l'interface Supabase

### Option 1 : Interface graphique (Recommandée)

1. **Accéder à Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet : `dhecegehcjelbxydeolg`

2. **Naviguer vers Authentication**
   - Dans le menu latéral : `Authentication` > `Users`

3. **Réinitialiser les mots de passe**

   Pour chaque utilisateur de test :

   **👤 Client de test**
   - Email : `akim.hachili@gmail.com`
   - Cliquez sur les 3 points (`...`) à droite
   - Sélectionnez `Reset Password`
   - Dans le modal, choisissez `Manual`
   - Entrez un nouveau mot de passe : `Password123!`
   - Confirmez

   **🏢 Partenaire de test**
   - Email : `partenaire@test.com`
   - Répétez les mêmes étapes
   - Mot de passe : `Password123!`

4. **Vérifier dans user_profiles**
   - Allez dans `Table Editor` > `user_profiles`
   - Vérifiez que les emails correspondent :
     - `akim.hachili@gmail.com` → role: `client`
     - `partenaire@test.com` → role: `partner`

### Option 2 : Via SQL (Si vous préférez)

```sql
-- Réinitialiser le mot de passe pour le client
UPDATE auth.users
SET
  encrypted_password = crypt('Password123!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'akim.hachili@gmail.com';

-- Réinitialiser le mot de passe pour le partenaire
UPDATE auth.users
SET
  encrypted_password = crypt('Password123!', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'partenaire@test.com';
```

### Option 3 : Créer de nouveaux utilisateurs

Si les utilisateurs n'existent pas encore :

```sql
-- Créer un client de test
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'akim.hachili@gmail.com',
  crypt('Password123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}'
);

-- Le trigger handle_new_user() créera automatiquement le profil client
```

## Test de connexion

Après le reset, testez la connexion :

1. **Démarrer l'application**
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

2. **Accéder à la page de login**
   - URL : http://localhost:5173/login

3. **Se connecter avec les credentials de test**

   **Client :**
   - Email : `akim.hachili@gmail.com`
   - Password : `Password123!`
   - Devrait rediriger vers → `/dashboard` (puis ClientDashboard)

   **Partenaire :**
   - Email : `partenaire@test.com`
   - Password : `Password123!`
   - Devrait rediriger vers → `/dashboard` (puis PartnerDashboard)

## Debugging

Si le login échoue toujours :

1. **Vérifier les variables d'environnement**
   ```bash
   cat .env | grep VITE_SUPABASE
   ```

2. **Vérifier la console navigateur**
   - Ouvrez DevTools (F12)
   - Onglet Console : cherchez les erreurs Supabase
   - Onglet Network : vérifiez les requêtes à `dhecegehcjelbxydeolg.supabase.co`

3. **Vérifier les logs Supabase**
   - Dashboard Supabase > Logs > Auth Logs
   - Cherchez les tentatives de login échouées

4. **Tester la connexion directe**
   ```javascript
   // Dans la console navigateur
   const { supabase } = await import('./src/lib/supabase');
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'akim.hachili@gmail.com',
     password: 'Password123!'
   });
   console.log({ data, error });
   ```

## Notes importantes

- ⚠️ **Mots de passe de test** : Utilisez `Password123!` uniquement en dev
- 🔒 **Production** : Utilisez des mots de passe forts et uniques
- ✉️ **Email confirmation** : Désactivé en dev (ON UPDATE SET email_confirmed_at = NOW())
- 🔄 **Trigger auto** : Le profil user_profiles se crée automatiquement après la migration
