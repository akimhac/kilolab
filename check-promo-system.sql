-- 1. Vérifier la table promo_usage (limite 1 utilisation par user)
SELECT * FROM promo_usage LIMIT 5;

-- 2. Vérifier les contraintes
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'promo_usage';

-- 3. Vérifier la contrainte UNIQUE
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'promo_usage'::regclass;
