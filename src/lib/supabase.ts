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
