#!/bin/bash

echo "🔧 FIX COMPLET - TOUS LES PROBLÈMES"
echo "===================================="

# 1. Retirer CSP
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

# 2. Installer Leaflet localement
npm install leaflet --save

# 3. Fixer imports Leaflet
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|https://unpkg.com/leaflet@1.9.4/dist/leaflet.css|leaflet/dist/leaflet.css|g' {} \;

# 4. Améliorer Supabase client
cat > src/lib/supabase.ts << 'ENDOFFILE'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lymykkbhbehwbdpajduj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bXlra2JoYmVod2JkcGFqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODQ4NjksImV4cCI6MjA0NjU2MDg2OX0.KPmLLnDMa9FxkDmZOhfzXtdDjQzkWBNdW7I1cE0u_C0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

console.log('✅ Supabase initialisé');
ENDOFFILE

# 5. Commit et push
git add .
git commit -m "fix: retrait CSP + Leaflet local + amélioration Supabase"
git push origin main

echo ""
echo "✅ TOUS LES FIXES APPLIQUÉS"
echo "🔄 Attends 2 minutes pour le redeploy Netlify"
