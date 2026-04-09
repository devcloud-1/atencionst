-- Ejecuta este SQL en Supabase → SQL Editor → New query

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  visit_type    TEXT NOT NULL CHECK (visit_type IN ('consulta', 'reparacion')),
  comment       TEXT,
  name          TEXT,
  phone         TEXT,
  email         TEXT,
  google_redirected BOOLEAN NOT NULL DEFAULT false
);

-- Índices para filtros frecuentes
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_visit_type_idx ON reviews (visit_type);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews (rating);

-- Row Level Security: solo el service role puede leer/escribir
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Política: solo el service role (backend) tiene acceso completo
-- El anon key NO puede acceder directamente a la tabla
CREATE POLICY "service_role_only" ON reviews
  USING (false)
  WITH CHECK (false);

-- Nota: el INSERT y SELECT se hacen desde el servidor con supabaseAdmin
-- (service role key), que bypasea RLS automáticamente.
