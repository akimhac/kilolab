import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 ERREUR CRITIQUE : Les clés Supabase (URL ou KEY) sont manquantes !");
  console.error("Vérifiez vos variables d'environnement dans Vercel.");
}

// On crée le client même s'il manque des clés pour éviter le crash immédiat (White Screen)
// Mais les requêtes échoueront proprement plus tard.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
