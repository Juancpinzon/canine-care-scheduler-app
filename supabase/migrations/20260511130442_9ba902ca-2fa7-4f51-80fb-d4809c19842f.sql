
-- Helper: updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin','client')),
  full_name TEXT,
  phone TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'es',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer to check admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin');
$$;

CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_delete_admin" ON public.profiles FOR DELETE
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'es')
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DOGS
CREATE TABLE public.dogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  size TEXT CHECK (size IN ('xs','small','medium','large','xl','xxl')),
  sex TEXT CHECK (sex IN ('male','female')),
  is_neutered BOOLEAN DEFAULT false,
  date_of_birth DATE,
  weight_lbs NUMERIC,
  color TEXT,
  photo_url TEXT,
  vet_name TEXT,
  vet_phone TEXT,
  allergies TEXT,
  medical_notes TEXT,
  vaccination_rabies_date DATE,
  vaccination_bordetella_date DATE,
  vaccination_dhpp_date DATE,
  is_dog_friendly BOOLEAN NOT NULL DEFAULT true,
  is_human_friendly BOOLEAN NOT NULL DEFAULT true,
  behavior_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dogs_select" ON public.dogs FOR SELECT
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "dogs_insert" ON public.dogs FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "dogs_update" ON public.dogs FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "dogs_delete" ON public.dogs FOR DELETE
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE TRIGGER trg_dogs_updated BEFORE UPDATE ON public.dogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SERVICES
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  price_xs NUMERIC,
  price_small NUMERIC,
  price_medium NUMERIC,
  price_large NUMERIC,
  price_xl NUMERIC,
  price_xxl NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_select_public" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_write_admin" ON public.services FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- BUSINESS SCHEDULES
CREATE TABLE public.business_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6) UNIQUE,
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time TEXT,
  close_time TEXT,
  max_concurrent_appointments INT NOT NULL DEFAULT 1
);
ALTER TABLE public.business_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedules_select_public" ON public.business_schedules FOR SELECT USING (true);
CREATE POLICY "schedules_write_admin" ON public.business_schedules FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- BLOCKED DATES
CREATE TABLE public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocked_select_public" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "blocked_write_admin" ON public.blocked_dates FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled','no_show')),
  price_charged_usd NUMERIC,
  notes_client TEXT,
  notes_admin TEXT,
  groomer_notes TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT,
  reminder_24h_sent BOOLEAN NOT NULL DEFAULT false,
  reminder_2h_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appt_select" ON public.appointments FOR SELECT
  USING (client_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "appt_insert" ON public.appointments FOR INSERT
  WITH CHECK (client_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "appt_update" ON public.appointments FOR UPDATE
  USING (client_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "appt_delete_admin" ON public.appointments FOR DELETE
  USING (public.is_admin(auth.uid()));
CREATE TRIGGER trg_appt_updated BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- APPOINTMENT STATUS HISTORY
CREATE TABLE public.appointment_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ash_select" ON public.appointment_status_history FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.client_id = auth.uid())
  );
CREATE POLICY "ash_insert" ON public.appointment_status_history FOR INSERT
  WITH CHECK (
    public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.client_id = auth.uid())
  );

-- SEED: services
INSERT INTO public.services (name, description, duration_minutes, price_xs, price_small, price_medium, price_large, price_xl, price_xxl, sort_order) VALUES
('Full Groom', 'Servicio completo: baño, secado, corte de pelo, uñas y oídos.', 120, 65, 65, 85, 100, 125, 140, 1),
('Minigroom', 'Baño, secado, cepillado, uñas y limpieza de oídos (sin corte de pelo).', 60, 50, 50, 60, 100, 110, 130, 2),
('Luxury Bath', 'Baño de lujo con productos premium y tratamiento hidratante.', 90, 45, 45, 50, 60, 65, 70, 3),
('Nail Trim', 'Corte de uñas.', 15, 15, 15, 15, 15, 15, 15, 4),
('Ear Clean', 'Limpieza profunda de oídos.', 15, 12, 12, 12, 12, 12, 12, 5),
('Teeth Brushing', 'Cepillado dental.', 15, 10, 10, 10, 10, 10, 10, 6);

-- SEED: business_schedules
INSERT INTO public.business_schedules (day_of_week, is_open, open_time, close_time, max_concurrent_appointments) VALUES
(0, false, NULL, NULL, 0),
(1, true, '09:00', '17:00', 4),
(2, true, '09:00', '17:00', 4),
(3, true, '09:00', '17:00', 4),
(4, true, '09:00', '17:00', 4),
(5, true, '09:00', '17:00', 4),
(6, true, '09:00', '15:00', 3);
