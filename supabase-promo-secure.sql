-- Tables codes promo (si pas déjà créées)
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_promo_usage_user ON promo_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_code ON promo_usage(promo_code_id);

-- Fonction incrément
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE promo_codes SET uses_count = uses_count + 1 WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql;

-- Codes promo initiaux SÉCURISÉS
INSERT INTO promo_codes (code, discount_type, discount_value, max_uses, expires_at)
VALUES
  ('BIENVENUE30', 'percent', 30, NULL, '2025-12-31'),
  ('LAUNCH2025', 'percent', 25, 500, '2025-03-31'),
  ('FIRST10', 'fixed', 1000, NULL, '2025-12-31')
ON CONFLICT (code) DO NOTHING;
