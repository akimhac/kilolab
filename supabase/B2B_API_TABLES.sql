-- ═══════════════════════════════════════════════════════════════════════════
-- KILOLAB - B2B PARTNERS API TABLES
-- Tables pour l'API partenaires (hôtels, Airbnb, gyms)
-- ═══════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════
-- 1. TABLE B2B_PARTNERS (Partenaires B2B)
-- ══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.b2b_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT NOT NULL UNIQUE,
  contact_phone TEXT,
  
  -- API Access
  api_key TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  prefix TEXT DEFAULT 'B2B', -- Prefix for order references
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Billing
  discount_percent INTEGER DEFAULT 10 CHECK (discount_percent >= 0 AND discount_percent <= 50),
  billing_type TEXT DEFAULT 'monthly' CHECK (billing_type IN ('per_order', 'monthly', 'prepaid')),
  billing_email TEXT,
  
  -- Business info
  business_type TEXT CHECK (business_type IN ('hotel', 'airbnb', 'gym', 'corporate', 'other')),
  address TEXT,
  city TEXT,
  website TEXT,
  logo_url TEXT,
  
  -- Stats
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contract
  contract_start_date DATE,
  contract_end_date DATE
);

-- Index for fast API key lookup
CREATE INDEX IF NOT EXISTS idx_b2b_partners_api_key ON public.b2b_partners(api_key);
CREATE INDEX IF NOT EXISTS idx_b2b_partners_is_active ON public.b2b_partners(is_active);

-- ══════════════════════════════════════════════════════════════════════
-- 2. TABLE B2B_API_LOGS (Logs des appels API)
-- ══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.b2b_api_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.b2b_partners(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  request_body JSONB,
  response_status INTEGER,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for partner logs
CREATE INDEX IF NOT EXISTS idx_b2b_api_logs_partner_id ON public.b2b_api_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_b2b_api_logs_created_at ON public.b2b_api_logs(created_at);

-- ══════════════════════════════════════════════════════════════════════
-- 3. AJOUTER COLONNES B2B À LA TABLE ORDERS
-- ══════════════════════════════════════════════════════════════════════

-- Colonne pour lier les commandes aux partenaires B2B
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.b2b_partners(id) ON DELETE SET NULL;

-- Colonnes pour les commandes B2B sans compte client
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS guest_name TEXT;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS guest_email TEXT;
  
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- Metadata JSON pour données B2B additionnelles
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Index
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON public.orders(partner_id);

-- ══════════════════════════════════════════════════════════════════════
-- 4. RLS POUR B2B_PARTNERS
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE public.b2b_partners ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir et gérer les partenaires
DROP POLICY IF EXISTS admins_manage_b2b_partners ON public.b2b_partners;
CREATE POLICY admins_manage_b2b_partners ON public.b2b_partners
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ══════════════════════════════════════════════════════════════════════
-- 5. RLS POUR B2B_API_LOGS
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE public.b2b_api_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les logs
DROP POLICY IF EXISTS admins_view_b2b_logs ON public.b2b_api_logs;
CREATE POLICY admins_view_b2b_logs ON public.b2b_api_logs
  FOR SELECT TO authenticated
  USING (is_admin());

-- Le système peut créer des logs (via service role)
DROP POLICY IF EXISTS service_create_b2b_logs ON public.b2b_api_logs;
CREATE POLICY service_create_b2b_logs ON public.b2b_api_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════════
-- 6. TRIGGER POUR METTRE À JOUR LES STATS DU PARTENAIRE
-- ══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_b2b_partner_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mettre à jour les stats quand une commande est complétée
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.partner_id IS NOT NULL THEN
    UPDATE b2b_partners
    SET 
      total_orders = total_orders + 1,
      total_revenue = total_revenue + COALESCE(NEW.total_price, 0),
      updated_at = NOW()
    WHERE id = NEW.partner_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_b2b_stats ON public.orders;
CREATE TRIGGER trigger_update_b2b_stats
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_b2b_partner_stats();

-- ══════════════════════════════════════════════════════════════════════
-- 7. FONCTION POUR GÉNÉRER UNE NOUVELLE CLÉ API
-- ══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.regenerate_b2b_api_key(p_partner_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_key TEXT;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Générer nouvelle clé
  new_key := encode(gen_random_bytes(32), 'hex');
  
  -- Mettre à jour
  UPDATE b2b_partners
  SET api_key = new_key, updated_at = NOW()
  WHERE id = p_partner_id;
  
  RETURN new_key;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════
-- 8. CRÉER UN PARTENAIRE DE TEST
-- ══════════════════════════════════════════════════════════════════════

-- Commenter cette section si vous ne voulez pas de données de test
INSERT INTO public.b2b_partners (
  company_name,
  contact_name,
  contact_email,
  business_type,
  discount_percent,
  prefix,
  notes
) VALUES (
  'Hôtel Demo',
  'Jean Demo',
  'demo@hotel-demo.fr',
  'hotel',
  15,
  'HOTEL',
  'Compte de test pour la documentation API'
) ON CONFLICT (contact_email) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════
-- 9. VÉRIFICATION
-- ══════════════════════════════════════════════════════════════════════

-- Afficher les tables créées
SELECT 
  table_name,
  '✅ OK' as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('b2b_partners', 'b2b_api_logs');

-- Afficher le partenaire de test
SELECT 
  company_name,
  api_key,
  discount_percent,
  is_active
FROM b2b_partners
LIMIT 1;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIN - API B2B PRÊTE !
-- ═══════════════════════════════════════════════════════════════════════════
