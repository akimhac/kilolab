-- Vérifier que la table orders existe et a les bonnes colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';

-- Si la table n'existe pas, la créer :
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  weight_kg DECIMAL(10,2) NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('premium', 'express', 'ultra_express')),
  price_per_kg DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled')),
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can view orders assigned to them"
  ON orders FOR SELECT
  USING (partner_id IN (
    SELECT id FROM partners WHERE user_id = auth.uid()
  ));
