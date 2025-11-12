#!/bin/bash

echo "🔧 CORRECTION SIMPLE - BON LIEN SUPABASE"
echo "========================================"

# 1. Nettoyer TOUS les fichiers .env
rm -f .env .env.local .env.development .env.production

# 2. Créer le BON .env avec dhecegehcjelbxydeolg
cat > .env << 'ENDOFFILE'
VITE_SUPABASE_URL=https://dhecegehcjelbxydeolg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjU2MTIsImV4cCI6MjA0NzAwMTYxMn0.sb_publishable_n_6IppNa1-MA66zQc-459Q_zUUxkuVc
ENDOFFILE

# 3. Créer .env.production identique
cp .env .env.production

# 4. Corriger supabase.ts - VERSION SIMPLE
cat > src/lib/supabase.ts << 'ENDOFFILE'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dhecegehcjelbxydeolg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjU2MTIsImV4cCI6MjA0NzAwMTYxMn0.sb_publishable_n_6IppNa1-MA66zQc-459Q_zUUxkuVc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
ENDOFFILE

# 5. Supprimer le proxy (pas besoin)
rm -rf netlify/functions/supabase-proxy.js
rm -rf netlify/functions/supabase-proxy.ts

# 6. Nettoyer netlify.toml
cat > netlify.toml << 'ENDOFFILE'
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "22"
ENDOFFILE

# 7. Build
echo ""
echo "🔨 Test build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ BUILD OK !"
  
  # 8. Commit
  git add .
  git commit -m "fix: correction URL Supabase vers dhecegehcjelbxydeolg (le bon projet)"
  git push origin main
  
  echo ""
  echo "🎉 TERMINÉ !"
  echo ""
  echo "📋 PROCHAINES ÉTAPES:"
  echo "   1. Va sur Netlify Dashboard"
  echo "   2. Environment variables"
  echo "   3. Mets:"
  echo "      VITE_SUPABASE_URL=https://dhecegehcjelbxydeolg.supabase.co"
  echo "      VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjU2MTIsImV4cCI6MjA0NzAwMTYxMn0.sb_publishable_n_6IppNa1-MA66zQc-459Q_zUUxkuVc"
  echo ""
  echo "   4. Trigger deploy → Clear cache"
  echo "   5. Teste https://kilolab.fr/login"
else
  echo ""
  echo "❌ Erreur build"
fi
