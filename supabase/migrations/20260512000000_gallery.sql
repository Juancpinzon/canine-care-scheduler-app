-- Crear tabla de fotos de la galería
CREATE TABLE gallery_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url   text NOT NULL,
  caption     text,
  is_visible  boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- SELECT público
CREATE POLICY "public_read" ON gallery_photos FOR SELECT TO public USING (true);

-- write solo admin
CREATE POLICY "admin_write" ON gallery_photos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bucket en Supabase Storage: "gallery"
-- Nota: La creación de buckets a veces requiere permisos especiales o se hace vía dashboard.
-- Intentamos insertarlo en storage.buckets si tenemos permiso.
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket "gallery"
CREATE POLICY "gallery_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'gallery');
CREATE POLICY "gallery_admin_all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'gallery' AND (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')))
  WITH CHECK (bucket_id = 'gallery' AND (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')));
