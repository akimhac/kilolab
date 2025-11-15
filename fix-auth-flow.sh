#!/bin/bash

echo "🔧 Correction du flow d'authentification..."

cat > src/lib/supabase.ts << 'ENDOFFILE'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhecegehcjelbxydeolg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // ← CHANGEMENT ICI
    flowType: 'implicit' // ← CHANGEMENT ICI (au lieu de pkce)
  }
});
ENDOFFILE

echo "✅ Fichier supabase.ts corrigé !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. git add ."
echo "2. git commit -m 'fix: change auth flow to implicit'"
echo "3. git push"
echo "4. Testez sur https://kilolab.fr"
