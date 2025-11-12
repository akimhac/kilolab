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
