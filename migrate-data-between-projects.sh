#!/bin/bash

echo "📦 MIGRATION DES DONNÉES VERS LE BON PROJET"
echo "==========================================="
echo ""
echo "⚠️  Tu as 2 projets Supabase:"
echo "   1. lymykkbhbehwbdpajduj (ancien, avec 2678 pressings)"
echo "   2. dhecegehcjelbxydeolg (nouveau, vide)"
echo ""
echo "🎯 SOLUTION:"
echo ""
echo "Option A (Recommandée): Utiliser l'ancien projet"
echo "   → On rechange l'URL vers lymykkbhbehwbdpajduj"
echo "   → Les données sont déjà là"
echo ""
echo "Option B: Migrer les données"
echo "   → Export de lymykkbhbehwbdpajduj"
echo "   → Import dans dhecegehcjelbxydeolg"
echo "   → Plus long (30 min)"
echo ""
read -p "Choisis: A ou B ? " choice

if [ "$choice" = "A" ] || [ "$choice" = "a" ]; then
  echo ""
  echo "�� Retour vers lymykkbhbehwbdpajduj..."
  
  # Récupérer l'ancienne clé anon
  OLD_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bXlra2JoYmVod2JkcGFqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODQ4NjksImV4cCI6MjA0NjU2MDg2OX0.KPmLLnDMa9FxkDmZOhfzXtdDjQzkWBNdW7I1cE0u_C0"
  
  cat > src/lib/supabase.ts << ENDOFFILE
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lymykkbhbehwbdpajduj.supabase.co';
const supabaseAnonKey = '${OLD_KEY}';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
ENDOFFILE

  cat > .env << ENDOFFILE
VITE_SUPABASE_URL=https://lymykkbhbehwbdpajduj.supabase.co
VITE_SUPABASE_ANON_KEY=${OLD_KEY}
ENDOFFILE
  
  cp .env .env.production
  
  npm run build
  git add .
  git commit -m "fix: retour vers lymykkbhbehwbdpajduj (projet avec données)"
  git push origin main
  
  echo ""
  echo "✅ Code mis à jour pour utiliser l'ancien projet"
  echo ""
  echo "📋 SUR NETLIFY, change:"
  echo "   VITE_SUPABASE_URL=https://lymykkbhbehwbdpajduj.supabase.co"
  echo "   VITE_SUPABASE_ANON_KEY=${OLD_KEY}"
  
else
  echo ""
  echo "📋 MIGRATION MANUELLE:"
  echo ""
  echo "1. Va sur: https://supabase.com/dashboard/project/lymykkbhbehwbdpajduj"
  echo "2. Table Editor → partners → Export as CSV"
  echo "3. Va sur: https://supabase.com/dashboard/project/dhecegehcjelbxydeolg"  
  echo "4. Table Editor → partners → Import CSV"
  echo ""
  echo "Répète pour: user_profiles, orders, promo_codes, promo_usage"
fi
