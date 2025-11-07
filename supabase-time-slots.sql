CREATE TABLE IF NOT EXISTS partner_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créneaux par défaut (8h-20h tous les jours)
CREATE OR REPLACE FUNCTION create_default_slots_for_partner(p_partner_id UUID)
RETURNS void AS $$
BEGIN
  FOR day IN 0..6 LOOP
    INSERT INTO partner_time_slots (partner_id, day_of_week, start_time, end_time)
    VALUES (p_partner_id, day, '08:00', '20:00');
  END LOOP;
END;
$$ LANGUAGE plpgsql;
