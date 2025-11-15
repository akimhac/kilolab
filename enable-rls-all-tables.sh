#!/bin/bash

echo "🔧 Activation du RLS sur toutes les tables..."

cat > enable-rls.sql << 'ENDSQL'
-- Activer RLS sur toutes les tables
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies pour partners (lecture publique)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.partners;
CREATE POLICY "Enable read access for all users" 
ON public.partners FOR SELECT 
USING (true);

-- Policies pour orders (lecture par utilisateur)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policies pour reviews (lecture publique)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reviews;
CREATE POLICY "Enable read access for all users" 
ON public.reviews FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert reviews" ON public.reviews;
CREATE POLICY "Users can insert reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policies pour referral_codes (lecture publique)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.referral_codes;
CREATE POLICY "Enable read access for all users" 
ON public.referral_codes FOR SELECT 
USING (true);

-- Policies pour user_profiles (lecture par utilisateur)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policies pour partner_time_slots (lecture publique)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.partner_time_slots;
CREATE POLICY "Enable read access for all users" 
ON public.partner_time_slots FOR SELECT 
USING (true);

-- Policies pour promo_codes et promo_usage (lecture publique)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.promo_codes;
CREATE POLICY "Enable read access for all users" 
ON public.promo_codes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.promo_usage;
CREATE POLICY "Enable read access for all users" 
ON public.promo_usage FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.referral_usage;
CREATE POLICY "Enable read access for all users" 
ON public.referral_usage FOR SELECT 
USING (true);
ENDSQL

echo "✅ Script SQL créé : enable-rls.sql"
echo ""
echo "🎯 ALLEZ MAINTENANT DANS SUPABASE :"
echo "1. Ouvrez https://supabase.com/dashboard/project/dhecegehcjelbxydeolg/editor"
echo "2. Cliquez sur 'SQL Editor' dans le menu de gauche"
echo "3. Cliquez sur 'New Query'"
echo "4. Copiez TOUT le contenu du fichier enable-rls.sql"
echo "5. Collez-le dans l'éditeur SQL"
echo "6. Cliquez sur 'Run'"
echo ""
echo "Pour voir le contenu du fichier SQL :"
echo "cat enable-rls.sql"
