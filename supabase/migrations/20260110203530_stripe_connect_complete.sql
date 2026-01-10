-- Ajouter toutes les colonnes Stripe Connect
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT FALSE;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_account 
ON user_profiles(stripe_account_id);

-- Commentaires
COMMENT ON COLUMN user_profiles.stripe_account_id IS 'ID du compte Stripe Connect Express';
COMMENT ON COLUMN user_profiles.stripe_onboarding_complete IS 'Onboarding Stripe terminé et validé';
COMMENT ON COLUMN user_profiles.stripe_charges_enabled IS 'Paiements par carte activés';
COMMENT ON COLUMN user_profiles.stripe_payouts_enabled IS 'Virements bancaires activés';
COMMENT ON COLUMN user_profiles.stripe_details_submitted IS 'Informations business soumises';
