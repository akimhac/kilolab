#!/bin/bash

echo "🔧 SETUP PROXY SUPABASE VIA NETLIFY FUNCTIONS"
echo "=============================================="

# 1. Créer la fonction proxy
mkdir -p netlify/functions

cat > netlify/functions/supabase-proxy.ts << 'ENDOFFILE'
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lymykkbhbehwbdpajduj.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  // Extraire le path après /api/
  const apiPath = event.path.replace('/.netlify/functions/supabase-proxy', '');
  const url = `${supabaseUrl}${apiPath}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
  console.log('🔄 Proxying to:', url);
  
  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'apikey': supabaseKey!,
        'Authorization': event.headers.authorization || `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: event.body || undefined,
    });
    
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: data,
    };
  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
ENDOFFILE

# 2. Modifier supabase.ts pour utiliser le proxy
cat > src/lib/supabase.ts << 'ENDOFFILE'
import { createClient } from '@supabase/supabase-js';

// En production, utiliser le proxy Netlify
const isProduction = window.location.hostname !== 'localhost';
const supabaseUrl = isProduction 
  ? 'https://kilolab.fr/.netlify/functions/supabase-proxy'
  : (import.meta.env.VITE_SUPABASE_URL || 'https://lymykkbhbehwbdpajduj.supabase.co');

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bXlra2JoYmVod2JkcGFqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODQ4NjksImV4cCI6MjA0NjU2MDg2OX0.KPmLLnDMa9FxkDmZOhfzXtdDjQzkWBNdW7I1cE0u_C0';

console.log('🔍 Mode:', isProduction ? 'PRODUCTION (proxy)' : 'DEV (direct)');
console.log('🔍 Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

console.log('✅ Supabase client initialisé');
ENDOFFILE

# 3. Installer @netlify/functions si pas déjà fait
npm install --save-dev @netlify/functions

# 4. Test build
echo ""
echo "🔨 Test build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ BUILD RÉUSSI !"
  echo ""
  echo "📤 Push vers GitHub..."
  git add .
  git commit -m "feat: proxy Netlify pour contourner blocage Supabase"
  git push origin main
  
  echo ""
  echo "🎉 TERMINÉ !"
  echo ""
  echo "⏰ Attends 2-3 minutes pour le redeploy Netlify"
  echo "🧪 Puis teste: https://kilolab.fr/login"
else
  echo ""
  echo "❌ Erreur build, vérifie les logs ci-dessus"
fi
