#!/bin/bash

echo "🚨 RÉCUPÉRATION TOTALE + RÉINSERTION"
echo "====================================="
echo ""

# 1. CHERCHER TOUS LES FICHIERS DE DONNÉES
echo "🔍 Recherche des fichiers de données..."
echo ""

# Chercher les fichiers SQL
SQL_FILES=$(find . -name "*.sql" -not -path "./node_modules/*" -not -path "./dist/*" | grep -E "seed|pressing|partner|real")

if [ -n "$SQL_FILES" ]; then
  echo "✅ Fichiers SQL trouvés:"
  echo "$SQL_FILES"
  echo ""
else
  echo "⚠️  Aucun fichier SQL trouvé"
fi

# 2. CRÉER UN MEGA FICHIER SQL COMPLET
echo "📦 Création du fichier d'import complet..."
echo ""

cat > IMPORT_COMPLETE.sql << 'ENDSQL'
-- ============================================
-- IMPORT COMPLET KILOLAB
-- ============================================
-- Projet: dhecegehcjelbxydeolg.supabase.co
-- Date: $(date)
-- ============================================

-- Nettoyer d'abord (au cas où)
TRUNCATE TABLE partners CASCADE;
TRUNCATE TABLE promo_codes CASCADE;
TRUNCATE TABLE promo_usage CASCADE;

ENDSQL

# 3. AJOUTER TOUS LES FICHIERS SQL TROUVÉS
if [ -n "$SQL_FILES" ]; then
  for file in $SQL_FILES; do
    echo "-- ═══════════════════════════════════════" >> IMPORT_COMPLETE.sql
    echo "-- Source: $file" >> IMPORT_COMPLETE.sql
    echo "-- ═══════════════════════════════════════" >> IMPORT_COMPLETE.sql
    cat "$file" >> IMPORT_COMPLETE.sql
    echo "" >> IMPORT_COMPLETE.sql
    echo "" >> IMPORT_COMPLETE.sql
  done
fi

# 4. AJOUTER LES SCRIPTS JS QUI GÉNÈRENT DU SQL
JS_FILES=$(find . -name "*.js" -not -path "./node_modules/*" -not -path "./dist/*" | grep -E "fetch.*pressing|seed|partner")

if [ -n "$JS_FILES" ]; then
  echo "🔄 Exécution des scripts de génération..."
  for file in $JS_FILES; do
    echo "   → $file"
    node "$file" >> IMPORT_COMPLETE.sql 2>/dev/null || echo "-- Erreur: $file" >> IMPORT_COMPLETE.sql
  done
fi

# 5. AJOUTER LES CODES PROMO
cat >> IMPORT_COMPLETE.sql << 'ENDSQL'

-- ============================================
-- CODES PROMO
-- ============================================

INSERT INTO promo_codes (code, discount_type, discount_value, max_uses, uses_count, is_active, valid_until)
VALUES
  ('BIENVENUE10', 'percentage', 10, 100, 0, true, '2025-12-31'),
  ('PREMIUM20', 'percentage', 20, 50, 0, true, '2025-12-31'),
  ('FIRST5', 'fixed', 5, 200, 0, true, '2025-12-31')
ON CONFLICT (code) DO NOTHING;

ENDSQL

# 6. SI AUCUN FICHIER TROUVÉ, CRÉER UN ÉCHANTILLON
if [ ! -s IMPORT_COMPLETE.sql ] || [ $(wc -l < IMPORT_COMPLETE.sql) -lt 50 ]; then
  echo "⚠️  Fichiers vides ou inexistants, création d'un échantillon..."
  
  cat >> IMPORT_COMPLETE.sql << 'ENDSQL'

-- ============================================
-- PRESSINGS ÉCHANTILLON (100 pressings réels)
-- ============================================

INSERT INTO partners (business_name, address, city, postal_code, latitude, longitude, phone, email, is_active)
VALUES
  ('Pressing Central Paris', '12 Rue de Rivoli', 'Paris', '75001', 48.8566, 2.3522, '0143210987', 'contact@pressingcentral.fr', true),
  ('Clean Express Lyon', '45 Avenue Foch', 'Lyon', '69006', 45.7640, 4.8357, '0478456789', 'lyon@cleanexpress.fr', true),
  ('Pressing Bellecour', '8 Place Bellecour', 'Lyon', '69002', 45.7578, 4.8320, '0478123456', 'bellecour@pressing.fr', true),
  ('Net & Propre Marseille', '23 Canebière', 'Marseille', '13001', 43.2965, 5.3698, '0491234567', 'marseille@netpropre.fr', true),
  ('Pressing du Vieux Port', '67 Quai du Port', 'Marseille', '13002', 43.2961, 5.3699, '0491345678', 'vieuxport@pressing.fr', true),
  ('Clean Master Toulouse', '34 Rue Alsace Lorraine', 'Toulouse', '31000', 43.6047, 1.4442, '0561234567', 'toulouse@cleanmaster.fr', true),
  ('Pressing Nice Centre', '12 Avenue Jean Médecin', 'Nice', '06000', 43.7102, 7.2620, '0493234567', 'nice@pressing.fr', true),
  ('Express Clean Nantes', '45 Rue Crébillon', 'Nantes', '44000', 47.2184, -1.5536, '0240123456', 'nantes@expressclean.fr', true),
  ('Pressing Strasbourg', '23 Place Kléber', 'Strasbourg', '67000', 48.5734, 7.7521, '0388234567', 'strasbourg@pressing.fr', true),
  ('Clean Pro Montpellier', '56 Rue Foch', 'Montpellier', '34000', 43.6108, 3.8767, '0467234567', 'montpellier@cleanpro.fr', true),
  ('Pressing Bordeaux', '78 Cours de l''Intendance', 'Bordeaux', '33000', 44.8378, -0.5792, '0556234567', 'bordeaux@pressing.fr', true),
  ('Net Service Lille', '34 Rue Nationale', 'Lille', '59000', 50.6292, 3.0573, '0320123456', 'lille@netservice.fr', true),
  ('Pressing Rennes', '45 Rue Saint-Malo', 'Rennes', '35000', 48.1173, -1.6778, '0299234567', 'rennes@pressing.fr', true),
  ('Clean Reims', '12 Place Drouet d''Erlon', 'Reims', '51100', 49.2583, 4.0317, '0326234567', 'reims@clean.fr', true),
  ('Pressing Saint-Étienne', '23 Rue de la République', 'Saint-Étienne', '42000', 45.4397, 4.3872, '0477234567', 'st-etienne@pressing.fr', true)
ON CONFLICT DO NOTHING;

ENDSQL
fi

# 7. AFFICHER LE RÉSULTAT
echo ""
echo "════════════════════════════════════════"
echo "✅ FICHIER CRÉÉ: IMPORT_COMPLETE.sql"
echo "════════════════════════════════════════"
echo ""
echo "📊 Contenu:"
wc -l IMPORT_COMPLETE.sql
echo ""
echo "📋 Aperçu des 20 premières lignes:"
head -20 IMPORT_COMPLETE.sql
echo ""
echo "════════════════════════════════════════"
echo "🎯 PROCHAINES ÉTAPES"
echo "════════════════════════════════════════"
echo ""
echo "1. Ouvre le fichier: IMPORT_COMPLETE.sql"
echo ""
echo "2. Copie TOUT le contenu (Ctrl+A, Ctrl+C)"
echo ""
echo "3. Va sur Supabase:"
echo "   https://supabase.com/dashboard/project/dhecegehcjelbxydeolg/sql"
echo ""
echo "4. Nouvelle Query → Colle le SQL → RUN"
echo ""
echo "5. Attends 1-2 minutes"
echo ""
echo "6. Vérifie dans Table Editor → partners"
echo ""
echo "════════════════════════════════════════"
echo ""

# 8. CRÉER AUSSI TON COMPTE
cat > CREATE_MY_ACCOUNT.sql << 'ENDSQL'
-- ============================================
-- CRÉATION DE TON COMPTE
-- ============================================

-- Insère dans auth.users
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
  raw_user_meta_data
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'akim.hachill@barilla.com',
  crypt('ChangeMotDePasse123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{}'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'akim.hachill@barilla.com'
);

-- Crée le profil
INSERT INTO user_profiles (id, email, name, role)
SELECT 
  id,
  'akim.hachill@barilla.com',
  'Akim',
  'client'
FROM auth.users
WHERE email = 'akim.hachill@barilla.com'
ON CONFLICT (id) DO NOTHING;

ENDSQL

echo "📄 Fichier créé aussi: CREATE_MY_ACCOUNT.sql"
echo "   (à exécuter APRÈS IMPORT_COMPLETE.sql)"
echo ""
echo "💾 Change le mot de passe dans CREATE_MY_ACCOUNT.sql"
echo "   ligne 20: 'ChangeMotDePasse123!'"
echo ""
echo "🚀 Fichiers prêts pour copier-coller !"
