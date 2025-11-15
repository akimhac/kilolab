#!/bin/bash

echo "🔧 FIX COMPLET - AJOUT TOUTES COLONNES MANQUANTES"
echo "=================================================="
echo ""

cat > FIX_ALL_COLUMNS.sql << 'ENDSQL'
-- ============================================
-- FIX COMPLET - AJOUT COLONNES MANQUANTES
-- ============================================

-- 1. FIX TABLE PARTNERS
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 2. FIX TABLE PROMO_CODES
ALTER TABLE promo_codes
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE;

-- 3. Index pour performances
CREATE INDEX IF NOT EXISTS idx_partners_location 
ON partners(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_promo_codes_validity
ON promo_codes(valid_until, is_active);

-- 4. Vérification
SELECT 'partners' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'partners' 
AND column_name IN ('latitude', 'longitude')
UNION ALL
SELECT 'promo_codes' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'promo_codes' 
AND column_name = 'valid_until';

ENDSQL

echo "✅ Fichier créé: FIX_ALL_COLUMNS.sql"
echo ""
echo "════════════════════════════════════════"
echo "📋 ÉTAPES À SUIVRE"
echo "════════════════════════════════════════"
echo ""
echo "1. Va sur Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/dhecegehcjelbxydeolg/sql"
echo ""
echo "2. Copie TOUT le contenu de: FIX_ALL_COLUMNS.sql"
echo ""
echo "3. Nouvelle Query → Colle → RUN"
echo ""
echo "4. Tu devrais voir:"
echo "   partners   | latitude  | double precision"
echo "   partners   | longitude | double precision"
echo "   promo_codes| valid_until| timestamp..."
echo ""
echo "5. Ensuite, réimporte IMPORT_COMPLETE.sql"
echo ""
