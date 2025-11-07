-- Table codes de parrainage
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  uses_count INTEGER DEFAULT 0,
  bonus_earned_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table utilisation parrainage
CREATE TABLE IF NOT EXISTS referral_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES user_profiles(id),
  referred_id UUID REFERENCES user_profiles(id),
  referral_code TEXT REFERENCES referral_codes(code),
  bonus_referrer_cents INTEGER DEFAULT 1000,
  bonus_referred_cents INTEGER DEFAULT 1000,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction générer code unique
CREATE OR REPLACE FUNCTION generate_referral_code(user_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 0;
BEGIN
  base_code := UPPER(SUBSTRING(REGEXP_REPLACE(user_name, '[^a-zA-Z]', '', 'g') FROM 1 FOR 6));
  IF LENGTH(base_code) < 3 THEN
    base_code := 'KILO';
  END IF;
  
  LOOP
    IF counter = 0 THEN
      final_code := base_code || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
    ELSE
      final_code := base_code || LPAD((counter)::TEXT, 2, '0');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM referral_codes WHERE code = final_code) THEN
      RETURN final_code;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Créer code parrainage automatiquement pour nouveaux clients
CREATE OR REPLACE FUNCTION create_referral_code_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'client' THEN
    INSERT INTO referral_codes (user_id, code)
    VALUES (NEW.id, generate_referral_code(NEW.name));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_referral_code
AFTER INSERT ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION create_referral_code_on_signup();

-- Index
CREATE INDEX idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX idx_referral_usage_referrer ON referral_usage(referrer_id);
CREATE INDEX idx_referral_usage_referred ON referral_usage(referred_id);
