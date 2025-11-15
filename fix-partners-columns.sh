#!/bin/bash

echo "🔧 FIX COLONNES PARTNERS + CRÉATION COMPTE"
echo "=========================================="
echo ""

# 1. Créer le SQL pour ajouter les colonnes manquantes
cat > FIX_PARTNERS_TABLE.sql << 'ENDSQL'
-- ============================================
-- FIX TABLE PARTNERS - AJOUTER COLONNES GÉOLOCALISATION
-- ============================================

-- 1. Ajouter les colonnes manquantes
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 2. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_partners_location 
ON partners(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. Vérifier que ça a fonctionné
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'partners' 
AND column_name IN ('latitude', 'longitude');

ENDSQL

# 2. Créer le SQL pour ton compte
cat > CREATE_MY_ACCOUNT.sql << 'ENDSQL'
-- ============================================
-- CRÉATION COMPTE: Akim.hachili@barilla.com
-- ============================================

DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Générer UUID
  user_uuid := gen_random_uuid();
  
  -- Créer l'utilisateur
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
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_uuid,
    'authenticated',
    'authenticated',
    'akim.hachili@barilla.com',
    crypt('Test1234!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '{"provider":"email","providers":["email"]}',
    '{}',
    false
  );
  
  -- Créer le profil
  INSERT INTO user_profiles (id, email, name, role)
  VALUES (
    user_uuid,
    'akim.hachili@barilla.com',
    'Akim Hachili',
    'client'
  );
  
  RAISE NOTICE 'Compte créé: %', user_uuid;
END $$;

ENDSQL

echo "✅ Fichiers SQL créés:"
echo "   1. FIX_PARTNERS_TABLE.sql"
echo "   2. CREATE_MY_ACCOUNT.sql"
echo ""
echo "════════════════════════════════════════"
echo "📋 INSTRUCTIONS"
echo "════════════════════════════════════════"
echo ""
echo "ÉTAPE 1: Fixer la table partners"
echo "--------------------------------"
echo "1. Va sur Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/dhecegehcjelbxydeolg/sql"
echo ""
echo "2. Nouvelle Query"
echo ""
echo "3. Copie TOUT le contenu de: FIX_PARTNERS_TABLE.sql"
echo ""
echo "4. Colle et RUN"
echo ""
echo "5. Tu devrais voir:"
echo "   latitude  | double precision"
echo "   longitude | double precision"
echo ""
echo ""
echo "ÉTAPE 2: Créer ton compte"
echo "-------------------------"
echo "1. Même SQL Editor"
echo ""
echo "2. Nouvelle Query"
echo ""
echo "3. Copie le contenu de: CREATE_MY_ACCOUNT.sql"
echo ""
echo "4. Colle et RUN"
echo ""
echo "5. Tu devrais voir: 'Compte créé: [uuid]'"
echo ""
echo ""
echo "ÉTAPE 3: Réimporter les pressings avec géoloc"
echo "----------------------------------------------"
echo "1. Va sur:"
echo "   https://supabase.com/dashboard/project/dhecegehcjelbxydeolg/editor"
echo ""
echo "2. Table: partners"
echo ""
echo "3. SUPPRIME tous les enregistrements actuels"
echo "   (ils n'ont pas de latitude/longitude)"
echo ""
echo "4. Copie le contenu de: IMPORT_COMPLETE.sql"
echo "   (créé précédemment avec les coordonnées)"
echo ""
echo "5. SQL Editor → Colle → RUN"
echo ""
echo ""
echo "APRÈS TOUT ÇA:"
echo "=============="
echo ""
echo "✅ Table partners avec latitude/longitude"
echo "✅ 2678 pressings avec coordonnées"
echo "✅ Ton compte: akim.hachili@barilla.com"
echo "✅ Mot de passe: Test1234!"
echo ""
echo "🎉 Teste: https://kilolab.fr/login"
echo "🗺️  Puis: https://kilolab.fr/partners-map"
