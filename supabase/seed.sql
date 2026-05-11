-- Q4 Paws Dog Grooming — Seed Data
-- Idempotent: only inserts if tables are empty (migration already seeds on first run)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.services LIMIT 1) THEN
    INSERT INTO public.services (name, description, duration_minutes, price_xs, price_small, price_medium, price_large, price_xl, price_xxl, sort_order) VALUES
    ('Full Groom',      'Servicio completo: baño, secado, corte de pelo, uñas y oídos.', 120, 65,  65,  85,  100, 125, 140, 1),
    ('Minigroom',       'Baño, secado, cepillado, uñas y limpieza de oídos (sin corte).', 60,  50,  50,  60,  100, 110, 130, 2),
    ('Luxury Bath',     'Baño de lujo con productos premium y tratamiento hidratante.',   90,  45,  45,  50,  60,  65,  70,  3),
    ('Nail Trim',       'Corte de uñas.',                                                 15,  15,  15,  15,  15,  15,  15,  4),
    ('Ear Clean',       'Limpieza profunda de oídos.',                                    15,  12,  12,  12,  12,  12,  12,  5),
    ('Teeth Brushing',  'Cepillado dental.',                                              15,  10,  10,  10,  10,  10,  10,  6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.business_schedules LIMIT 1) THEN
    -- 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
    INSERT INTO public.business_schedules (day_of_week, is_open, open_time, close_time, max_concurrent_appointments) VALUES
    (0, false, NULL,    NULL,    0),
    (1, true,  '09:00', '17:00', 4),
    (2, true,  '09:00', '17:00', 4),
    (3, true,  '09:00', '17:00', 4),
    (4, true,  '09:00', '17:00', 4),
    (5, true,  '09:00', '17:00', 4),
    (6, true,  '09:00', '15:00', 3);
  END IF;
END $$;
