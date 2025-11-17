-- Supprimer l'ancienne politique qui cause l'erreur
DROP POLICY IF EXISTS "Allow all on referral_codes" ON referral_codes;

-- Recréer correctement
CREATE POLICY "referral_codes_select_policy" 
ON referral_codes FOR SELECT 
USING (true);

CREATE POLICY "referral_codes_insert_policy" 
ON referral_codes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "referral_codes_update_policy" 
ON referral_codes FOR UPDATE 
USING (true);
