-- ============================================
-- KILOLAB v3.3 - Live Tracking & Advanced Analytics
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Table pour les positions GPS des Washers (temps réel)
CREATE TABLE IF NOT EXISTS washer_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  washer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  heading DECIMAL(5, 2), -- Direction en degrés (0-360)
  speed DECIMAL(5, 2), -- Vitesse en km/h
  accuracy DECIMAL(6, 2), -- Précision GPS en mètres
  altitude DECIMAL(8, 2),
  battery_level INTEGER, -- Niveau batterie en %
  is_online BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index pour les requêtes temps réel
CREATE INDEX IF NOT EXISTS idx_washer_locations_washer 
ON washer_locations(washer_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_washer_locations_online 
ON washer_locations(is_online, updated_at DESC) 
WHERE is_online = true;

-- 3. RLS pour washer_locations
ALTER TABLE washer_locations ENABLE ROW LEVEL SECURITY;

-- Les washers peuvent mettre à jour leur propre position
CREATE POLICY "Washers can update own location" ON washer_locations
  FOR ALL USING (auth.uid() = washer_id);

-- Les clients peuvent voir la position du washer assigné à leur commande
CREATE POLICY "Clients can view assigned washer location" ON washer_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.washer_id = washer_locations.washer_id 
      AND orders.client_id = auth.uid()
      AND orders.status IN ('assigned', 'picked_up', 'washing', 'ready', 'delivering')
    )
  );

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all locations" ON washer_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- 4. Fonction pour mettre à jour la position (upsert)
CREATE OR REPLACE FUNCTION update_washer_location(
  p_lat DECIMAL,
  p_lng DECIMAL,
  p_heading DECIMAL DEFAULT NULL,
  p_speed DECIMAL DEFAULT NULL,
  p_accuracy DECIMAL DEFAULT NULL,
  p_battery_level INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  location_id UUID;
BEGIN
  INSERT INTO washer_locations (washer_id, lat, lng, heading, speed, accuracy, battery_level, updated_at)
  VALUES (auth.uid(), p_lat, p_lng, p_heading, p_speed, p_accuracy, p_battery_level, NOW())
  ON CONFLICT (washer_id) 
  DO UPDATE SET 
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    heading = COALESCE(EXCLUDED.heading, washer_locations.heading),
    speed = COALESCE(EXCLUDED.speed, washer_locations.speed),
    accuracy = COALESCE(EXCLUDED.accuracy, washer_locations.accuracy),
    battery_level = COALESCE(EXCLUDED.battery_level, washer_locations.battery_level),
    is_online = true,
    updated_at = NOW()
  RETURNING id INTO location_id;
  
  RETURN location_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Unique constraint sur washer_id (une seule position active par washer)
ALTER TABLE washer_locations 
ADD CONSTRAINT washer_locations_washer_unique UNIQUE (washer_id);

-- 6. Fonction pour marquer un washer comme offline
CREATE OR REPLACE FUNCTION set_washer_offline()
RETURNS void AS $$
BEGIN
  UPDATE washer_locations 
  SET is_online = false, updated_at = NOW()
  WHERE washer_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Table pour l'historique des positions (optionnel, pour analytics)
CREATE TABLE IF NOT EXISTS washer_location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  washer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour l'historique
CREATE INDEX IF NOT EXISTS idx_washer_location_history_washer 
ON washer_location_history(washer_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_washer_location_history_order 
ON washer_location_history(order_id);

-- 8. Trigger pour enregistrer l'historique des positions
CREATE OR REPLACE FUNCTION record_location_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Enregistrer dans l'historique toutes les 5 minutes environ
  IF (
    NOT EXISTS (
      SELECT 1 FROM washer_location_history 
      WHERE washer_id = NEW.washer_id 
      AND recorded_at > NOW() - INTERVAL '5 minutes'
    )
  ) THEN
    INSERT INTO washer_location_history (washer_id, lat, lng)
    VALUES (NEW.washer_id, NEW.lat, NEW.lng);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_washer_location_update
  AFTER INSERT OR UPDATE ON washer_locations
  FOR EACH ROW
  EXECUTE FUNCTION record_location_history();

-- 9. Publication Realtime pour les positions
ALTER PUBLICATION supabase_realtime ADD TABLE washer_locations;

-- 10. Ajouter l'ETA estimée sur les commandes
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS estimated_arrival TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS actual_distance_km DECIMAL(6, 2);

-- ============================================
-- ANALYTICS TABLES
-- ============================================

-- 11. Table pour les événements analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'signup', 'order_created', 'order_paid', etc.
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_type 
ON analytics_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user 
ON analytics_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session 
ON analytics_events(session_id, created_at DESC);

-- RLS pour analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- 12. Fonction helper pour tracker un événement
CREATE OR REPLACE FUNCTION track_event(
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}',
  p_page_url TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (user_id, event_type, event_data, page_url, session_id)
  VALUES (auth.uid(), p_event_type, p_event_data, p_page_url, p_session_id)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Tables créées: washer_locations, washer_location_history, analytics_events' AS status;
