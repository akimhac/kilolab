-- Ajouter les colonnes Stripe Connect à user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT FALSE;

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_account 
ON user_profiles(stripe_account_id);

-- Commentaires
COMMENT ON COLUMN user_profiles.stripe_account_id IS 'ID du compte Stripe Connect';
COMMENT ON COLUMN user_profiles.stripe_onboarding_complete IS 'Onboarding Stripe terminé';
COMMENT ON COLUMN user_profiles.stripe_charges_enabled IS 'Paiements activés';
COMMENT ON COLUMN user_profiles.stripe_payouts_enabled IS 'Virements activés';
