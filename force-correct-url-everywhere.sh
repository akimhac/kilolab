#!/bin/bash

echo "🔧 FORCER LA BONNE URL PARTOUT"
echo "=============================="

# 1. HARDCODER dans supabase.ts (ignorer les variables)
cat > src/lib/supabase.ts << 'ENDOFFILE'
import { createClient } from '@supabase/supabase-js';

// HARDCODÉ - La seule vraie source de vérité
const supabaseUrl = 'https://dhecegehcjelbxydeolg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjU2MTIsImV4cCI6MjA0NzAwMTYxMn0.sb_publishable_n_6IppNa1-MA66zQc-459Q_zUUxkuVc';

console.log('🔗 Supabase URL HARDCODÉE:', supabaseUrl);
console.log('🔑 Has key:', !!supabaseAnonKey);

if (!supabaseUrl.includes('dhecegehcjelbxydeolg')) {
  throw new Error('ERREUR: Mauvaise URL Supabase détectée !');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

console.log('✅ Supabase client créé avec dhecegehcjelbxydeolg');
ENDOFFILE

# 2. Remplacer TOUTES les occurrences de l'ancienne URL
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./dist/*" \
  -exec sed -i 's|lymykkbhbehwbdpajduj|dhecegehcjelbxydeolg|g' {} \;

# 3. Remplacer dans les fichiers .env
find . -maxdepth 1 -name ".env*" -exec sed -i 's|lymykkbhbehwbdpajduj|dhecegehcjelbxydeolg|g' {} \;

# 4. Vérifier qu'il n'y a plus d'anciennes URLs
echo ""
echo "🔍 Vérification - Recherche de lymykkbhbehwbdpajduj:"
grep -r "lymykkbhbehwbdpajduj" . --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null || echo "✅ Aucune ancienne URL trouvée"

# 5. Clean complet
rm -rf node_modules/.vite
rm -rf dist
rm -rf .cache

# 6. Build from scratch
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ BUILD OK avec nouvelle URL"
  
  # 7. Vérifier que le build contient la bonne URL
  if grep -q "dhecegehcjelbxydeolg" dist/assets/*.js 2>/dev/null; then
    echo "✅ CONFIRMÉ: Build contient dhecegehcjelbxydeolg"
  else
    echo "❌ PROBLÈME: Build ne contient pas la bonne URL"
    exit 1
  fi
  
  # 8. Commit avec message fort
  git add .
  git commit -m "FIX CRITIQUE: Force URL Supabase dhecegehcjelbxydeolg PARTOUT (hardcodé)"
  git push origin main --force
  
  echo ""
  echo "🎉 URL FORCÉE PARTOUT"
  echo ""
  echo "⚠️  IMPORTANT SUR NETLIFY:"
  echo "   1. Va sur Deploys"
  echo "   2. Options → Clear cache and retry deploy"
  echo "   3. Attends 3 minutes"
  echo "   4. La console DOIT afficher: dhecegehcjelbxydeolg"
else
  echo ""
  echo "❌ Erreur build"
  exit 1
fi
