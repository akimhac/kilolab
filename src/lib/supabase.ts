import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lymykkbhbehwbdpajduj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bXlra2JoYmVod2JkcGFqZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODQ4NjksImV4cCI6MjA0NjU2MDg2OX0.KPmLLnDMa9FxkDmZOhfzXtdDjQzkWBNdW7I1cE0u_C0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('🔍 Initializing Supabase with:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Plus sécurisé
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: (url, options = {}) => {
      console.log('🌐 Fetching:', url);
      return fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'same-origin',
      });
    },
  },
});
