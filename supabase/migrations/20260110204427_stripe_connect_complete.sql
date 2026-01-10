-- Colonnes Stripe Connect
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_account 
ON user_profiles(stripe_account_id);

COMMENT ON COLUMN user_profiles.stripe_account_id IS 'ID compte Stripe Connect';
COMMENT ON COLUMN user_profiles.stripe_onboarding_complete IS 'Onboarding terminé';
COMMENT ON COLUMN user_profiles.password_set IS 'Mot de passe créé';
