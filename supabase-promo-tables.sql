CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  allow_multiple_uses BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id),
  user_id UUID REFERENCES user_profiles(id),
  order_id UUID REFERENCES orders(id),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction pour incrémenter usage
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE promo_codes SET uses_count = uses_count + 1 WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql;

-- Insérer codes promo de base
INSERT INTO promo_codes (code, discount_type, discount_value, max_uses, expires_at)
VALUES
  ('KILOLAB30', 'percent', 30, NULL, '2025-12-31'),
  ('BIENVENUE10', 'fixed', 1000, 1000, '2025-12-31'),
  ('NOEL2025', 'percent', 20, NULL, '2025-12-25');
