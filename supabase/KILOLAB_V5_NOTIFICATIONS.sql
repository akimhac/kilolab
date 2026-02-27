-- ============================================
-- KILOLAB v3.2 - Notifications Push & Heatmap Support
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Ajouter les colonnes pour FCM tokens
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS fcm_token TEXT,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT false;

-- 2. Index pour les requêtes de notifications
CREATE INDEX IF NOT EXISTS idx_user_profiles_fcm_token 
ON user_profiles(fcm_token) 
WHERE fcm_token IS NOT NULL;

-- 3. Table pour stocker l'historique des notifications
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- 4. RLS pour push_notifications
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON push_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON push_notifications
  FOR INSERT WITH CHECK (true);

-- 5. Index pour les requêtes de notifications
CREATE INDEX IF NOT EXISTS idx_push_notifications_user 
ON push_notifications(user_id, sent_at DESC);

-- 6. Ajouter les coordonnées GPS aux commandes (pour la heatmap)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS pickup_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS pickup_lng DECIMAL(11, 8);

-- 7. Index spatial pour les requêtes géographiques
CREATE INDEX IF NOT EXISTS idx_orders_location 
ON orders(pickup_lat, pickup_lng) 
WHERE pickup_lat IS NOT NULL AND pickup_lng IS NOT NULL;

-- 8. Fonction pour extraire les coordonnées depuis l'adresse (helper)
CREATE OR REPLACE FUNCTION extract_city_from_address(address TEXT)
RETURNS TEXT AS $$
DECLARE
  city TEXT;
BEGIN
  -- Extract city from French address format "Code Postal Ville"
  SELECT regexp_replace(address, '.*\d{5}\s+(.+)$', '\1') INTO city;
  RETURN city;
END;
$$ LANGUAGE plpgsql;

-- 9. Fonction pour envoyer une notification (à appeler depuis Edge Functions)
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO push_notifications (user_id, title, body, data)
  VALUES (p_user_id, p_title, p_body, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger pour notifier sur changement de statut de commande
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer une notification pour le client
  IF NEW.status != OLD.status THEN
    PERFORM create_notification(
      NEW.user_id,
      CASE NEW.status
        WHEN 'assigned' THEN 'Washer assigné !'
        WHEN 'picked_up' THEN 'Linge récupéré'
        WHEN 'washing' THEN 'Lavage en cours'
        WHEN 'ready' THEN 'Linge prêt !'
        WHEN 'delivered' THEN 'Livraison effectuée'
        ELSE 'Commande mise à jour'
      END,
      CASE NEW.status
        WHEN 'assigned' THEN 'Un Washer a accepté votre commande'
        WHEN 'picked_up' THEN 'Votre linge est en route vers la laverie'
        WHEN 'washing' THEN 'Votre linge est en cours de lavage'
        WHEN 'ready' THEN 'Votre linge est prêt à être livré'
        WHEN 'delivered' THEN 'Votre linge a été livré avec succès'
        ELSE 'Le statut de votre commande a changé'
      END,
      jsonb_build_object('type', 'order_update', 'orderId', NEW.id, 'status', NEW.status)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attacher le trigger (s'il n'existe pas déjà)
DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  'Columns added: ' || 
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = 'user_profiles' AND column_name IN ('fcm_token', 'notifications_enabled'))::TEXT
  AS status;
