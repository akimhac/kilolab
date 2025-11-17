-- Supprimer l'ancienne politique problématique
DROP POLICY IF EXISTS "Allow all on referral_codes" ON referral_codes;

-- Créer la nouvelle politique simple
CREATE POLICY "referral_codes_access" 
ON referral_codes 
AS PERMISSIVE
FOR ALL 
TO public
USING (true) 
WITH CHECK (true);
