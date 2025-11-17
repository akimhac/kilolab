DROP POLICY IF EXISTS "Allow all on referral_codes" ON referral_codes;

CREATE POLICY "referral_codes_policy" 
ON referral_codes 
FOR ALL 
USING (true) 
WITH CHECK (true);
