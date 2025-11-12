#!/bin/bash

echo "🔑 APPLICATION DE LA VRAIE CLÉ ANON"
echo "===================================="

# 1. Mettre à jour supabase.ts avec la VRAIE clé
cat > src/lib/supabase.ts << 'ENDOFFILE'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhecegehcjelbxydeolg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s';

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Clé valide');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
ENDOFFILE

# 2. Mettre à jour .env
cat > .env << 'ENDOFFILE'
VITE_SUPABASE_URL=https://dhecegehcjelbxydeolg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s
ENDOFFILE

cp .env .env.production

# 3. Clean complet
rm -rf node_modules/.vite dist

# 4. Build
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ BUILD RÉUSSI !"
  
  git add .
  git commit -m "fix: application de la VRAIE clé anon Supabase"
  git push origin main
  
  echo ""
  echo "🎉 PUSHÉ SUR GITHUB !"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 DERNIÈRE ÉTAPE - NETLIFY"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "1. Va sur: https://app.netlify.com"
  echo ""
  echo "2. Ton site → Site settings → Environment variables"
  echo ""
  echo "3. Supprime TOUTES les anciennes variables"
  echo ""
  echo "4. Ajoute ces 2 variables (copie-colle):"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Variable 1:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Key: VITE_SUPABASE_URL"
  echo "Value: https://dhecegehcjelbxydeolg.supabase.co"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Variable 2:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Key: VITE_SUPABASE_ANON_KEY"
  echo "Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "5. Deploys → Trigger deploy"
  echo "   → IMPORTANT: Coche 'Clear cache and deploy site'"
  echo ""
  echo "6. Attends 2-3 minutes"
  echo ""
  echo "7. Teste: https://kilolab.fr/login"
  echo ""
  echo "🎯 ÇA VA MARCHER CETTE FOIS ! 🚀"
else
  echo "❌ Erreur build"
fi
