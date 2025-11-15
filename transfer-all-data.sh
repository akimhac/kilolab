#!/bin/bash

echo "📦 TRANSFERT COMPLET DES DONNÉES"
echo "================================="
echo ""

# Projet SOURCE (ancien avec données)
SOURCE_URL="https://lymykkbhbehwbdpajduj.supabase.co"
SOURCE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bXlra2JoYmVod2JkcGFqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODQ4NjksImV4cCI6MjA0NjU2MDg2OX0.KPmLLnDMa9FxkDmZOhfzXtdDjQzkWBNdW7I1cE0u_C0"

# Projet DESTINATION (nouveau vide)
DEST_URL="https://dhecegehcjelbxydeolg.supabase.co"
DEST_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s"

# Créer script SQL de migration
cat > migration.sql << 'ENDSQL'
-- ============================================
-- SCRIPT DE MIGRATION COMPLET
-- ============================================

-- 1. EXPORT DES PARTNERS
-- Copie manuellement depuis:
-- https://supabase.com/dashboard/project/lymykkbhbehwbdpajduj
-- Table: partners → Export as CSV
-- Puis import dans dhecegehcjelbxydeolg

-- 2. EXPORT DES USER_PROFILES
-- Même processus

-- 3. EXPORT DES PROMO_CODES
-- Même processus

ENDSQL

echo "⚠️  MIGRATION MANUELLE REQUISE"
echo ""
echo "Je ne peux pas exporter automatiquement car il faut:"
echo "  1. Accès au service_role_key (pas l'anon key)"
echo "  2. Ou faire via l'interface Supabase Dashboard"
echo ""
echo "📋 INSTRUCTIONS COMPLÈTES:"
echo "=========================="
echo ""
echo "ÉTAPE 1: Export depuis l'ancien projet"
echo "---------------------------------------"
echo "1. Va sur: https://supabase.com/dashboard/project/lymykkbhbehwbdpajduj"
echo "2. Table Editor"
echo "3. Pour CHAQUE table ci-dessous:"
echo ""
echo "   📊 TABLE: partners"
echo "      → Clique sur 'partners'"
echo "      → Bouton '...' (3 points) → Export as CSV"
echo "      → Sauvegarde: partners.csv"
echo ""
echo "   📊 TABLE: user_profiles"
echo "      → Export as CSV"
echo "      → Sauvegarde: user_profiles.csv"
echo ""
echo "   📊 TABLE: promo_codes"
echo "      → Export as CSV"
echo "      → Sauvegarde: promo_codes.csv"
echo ""
echo "   📊 TABLE: promo_usage"
echo "      → Export as CSV"
echo "      → Sauvegarde: promo_usage.csv"
echo ""
echo "   📊 TABLE: orders (si elle existe)"
echo "      → Export as CSV"
echo "      → Sauvegarde: orders.csv"
echo ""
echo ""
echo "ÉTAPE 2: Import dans le nouveau projet"
echo "---------------------------------------"
echo "1. Va sur: https://supabase.com/dashboard/project/dhecegehcjelbxydeolg"
echo "2. Table Editor"
echo "3. Pour CHAQUE table:"
echo ""
echo "   📥 TABLE: partners"
echo "      → Clique sur 'partners'"
echo "      → Bouton 'Insert' → 'Import data from CSV'"
echo "      → Sélectionne: partners.csv"
echo "      → Import"
echo ""
echo "   📥 Répète pour:"
echo "      - user_profiles.csv"
echo "      - promo_codes.csv"
echo "      - promo_usage.csv"
echo "      - orders.csv (si existe)"
echo ""
echo ""
echo "ÉTAPE 3: Recréer ton compte"
echo "---------------------------"
echo "1. Sur: https://supabase.com/dashboard/project/dhecegehcjelbxydeolg"
echo "2. Authentication → Users"
echo "3. Add user → Manuel"
echo "4. Email: akim.hachill@barilla.com"
echo "5. Password: (ton mot de passe)"
echo "6. Auto Confirm User: OUI (cocher)"
echo ""
echo ""
echo "ÉTAPE 4: Vérification"
echo "---------------------"
echo "Retourne ici et tape 'ok' quand c'est fait"
echo ""
read -p "As-tu terminé l'import ? (ok pour continuer) " confirm

if [ "$confirm" = "ok" ]; then
  echo ""
  echo "🧪 Test de connexion au nouveau projet..."
  
  # Test si les partners sont là
  PARTNERS_COUNT=$(curl -s "$DEST_URL/rest/v1/partners?select=count" \
    -H "apikey: $DEST_KEY" \
    -H "Authorization: Bearer $DEST_KEY" | jq -r '.[0].count // 0')
  
  echo "📊 Nombre de partners trouvés: $PARTNERS_COUNT"
  
  if [ "$PARTNERS_COUNT" -gt 0 ]; then
    echo ""
    echo "✅ MIGRATION RÉUSSIE !"
    echo ""
    echo "🎉 Ton site est maintenant opérationnel avec:"
    echo "   - $PARTNERS_COUNT pressings"
    echo "   - Ton compte utilisateur"
    echo "   - Les codes promo"
    echo ""
    echo "🚀 Teste: https://kilolab.fr/login"
  else
    echo ""
    echo "⚠️  Aucun partner trouvé"
    echo "Vérifie que l'import CSV a bien fonctionné"
  fi
else
  echo ""
  echo "⏸️  Migration en pause"
  echo "Relance ce script quand tu auras fini l'import"
fi
