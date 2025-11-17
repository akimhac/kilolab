-- Table pour les demandes de partenariat
CREATE TABLE IF NOT EXISTS partner_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  postal_code VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  siret VARCHAR NOT NULL,
  description TEXT,
  services JSONB,
  opening_hours TEXT,
  status VARCHAR DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on partner_requests" 
ON partner_requests FOR ALL USING (true);

-- Fonction pour marquer les pressings suspects
CREATE OR REPLACE FUNCTION mark_suspicious_partners()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    CASE 
      WHEN p.phone IS NULL OR p.phone = '' THEN 'Pas de téléphone'
      WHEN p.email IS NULL OR p.email = '' THEN 'Pas d\'email'
      WHEN p.lat IS NULL OR p.lon IS NULL THEN 'Pas de coordonnées GPS'
      WHEN p.address LIKE '%test%' OR p.address LIKE '%fake%' THEN 'Adresse suspecte'
      ELSE 'OK'
    END as reason
  FROM partners p
  WHERE 
    p.phone IS NULL OR p.phone = ''
    OR p.email IS NULL OR p.email = ''
    OR p.lat IS NULL OR p.lon IS NULL
    OR p.address LIKE '%test%' OR p.address LIKE '%fake%';
END;
$$ LANGUAGE plpgsql;

-- Statistiques pressings
CREATE OR REPLACE FUNCTION get_partners_stats()
RETURNS TABLE (
  total INT,
  with_coords INT,
  with_phone INT,
  with_email INT,
  active INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INT as total,
    COUNT(*) FILTER (WHERE lat IS NOT NULL AND lon IS NOT NULL)::INT as with_coords,
    COUNT(*) FILTER (WHERE phone IS NOT NULL AND phone != '')::INT as with_phone,
    COUNT(*) FILTER (WHERE email IS NOT NULL AND email != '')::INT as with_email,
    COUNT(*) FILTER (WHERE is_active = true)::INT as active
  FROM partners;
END;
$$ LANGUAGE plpgsql;
