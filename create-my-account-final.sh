#!/bin/bash

echo "👤 CRÉATION DE TON COMPTE"
echo "========================="
echo ""

cat > CREATE_ACCOUNT.sql << 'ENDSQL'
-- ============================================
-- CRÉATION DU COMPTE akim.hachill@barilla.com
-- ============================================

-- 1. Créer l'utilisateur dans auth.users
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Générer un UUID
  user_uuid := gen_random_uuid();
  
  -- Insérer dans auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    email_change_token_new
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_uuid,
    'authenticated',
    'authenticated',
    'akim.hachill@barilla.com',
    crypt('MonMotDePasse123!', gen_salt('bf')), -- CHANGE LE MOT DE PASSE ICI !
    NOW(),
    NOW(),
    NOW(),
    '',
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    ''
  );
  
  -- Insérer dans user_profiles
  INSERT INTO user_profiles (id, email, name, role)
  VALUES (
    user_uuid,
    'akim.hachill@barilla.com',
    'Akim Hachill',
    'client'
  );
  
  RAISE NOTICE 'Compte créé avec succès: %', user_uuid;
END $$;

ENDSQL

echo "📄 Fichier créé: CREATE_ACCOUNT.sql"
echo ""
echo "⚠️  IMPORTANT: Change le mot de passe à la ligne 27 !"
echo "   Actuellement: MonMotDePasse123!"
echo ""
echo "�� INSTRUCTIONS:"
echo "================"
echo ""
echo "1. Ouvre CREATE_ACCOUNT.sql"
echo ""
echo "2. Ligne 27: Change le mot de passe"
echo "   crypt('TonMotDePasse', gen_salt('bf'))"
echo ""
echo "3. Copie TOUT le contenu"
echo ""
echo "4. Va sur Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/dhecegehcjelbxydeolg/sql"
echo ""
echo "5. Nouvelle Query → Colle → RUN"
echo ""
echo "6. Tu devrais voir: 'Compte créé avec succès'"
echo ""
echo "7. Teste la connexion sur: https://kilolab.fr/login"
echo "   Email: akim.hachill@barilla.com"
echo "   Password: (celui que tu as mis)"
echo ""
echo "🎉 APRÈS ÇA TON SITE SERA 100% FONCTIONNEL !"
