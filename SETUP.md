# Setup — Sistema de Reseñas Thermomix

## 1. Supabase (base de datos)

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (elige la región más cercana)
3. Ve a **SQL Editor → New query** y pega el contenido de `supabase_schema.sql`
4. Ejecuta el query (botón Run)
5. Ve a **Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Variables de entorno

Edita `.env.local` con los valores de Supabase y:

```bash
# Genera un secreto de sesión seguro:
openssl rand -hex 32
```

Coloca ese valor en `ADMIN_SESSION_SECRET`.

Elige una contraseña para `ADMIN_PASSWORD`.

## 3. URL de Google Reviews

1. Ve a Google Maps y busca tu negocio
2. Haz clic en **Reseñas → Escribe una reseña**
3. Copia la URL del navegador
4. Pégala en `NEXT_PUBLIC_GOOGLE_REVIEW_URL`

## 4. Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Vercel te pedirá las variables de entorno — agrega todas las del `.env.local`.

O bien:
1. Sube el proyecto a GitHub
2. Ve a https://vercel.com → Import Project
3. Conecta el repo y agrega las env vars en el dashboard

## 5. QR Code

Una vez desplegado en Vercel (ej: `https://mi-servicio.vercel.app`):

1. Ve a https://qr-code-generator.com (o cualquier generador)
2. Genera un QR para `https://mi-servicio.vercel.app/review`
3. Imprime y coloca en el mostrador, recibo de entrega, etc.

## 6. NFC Tag

1. Compra tags NFC (NTAG213, ~$1-2 c/u en MercadoLibre o Amazon)
2. Descarga la app **NFC Tools** (iOS/Android)
3. Escribe la URL `https://mi-servicio.vercel.app/review` en el tag
4. Pega el tag en el mostrador o en el equipo reparado

## Panel de administración

Accede en: `https://mi-servicio.vercel.app/admin`
Contraseña: la que definiste en `ADMIN_PASSWORD`

## Desarrollo local

```bash
npm run dev
```

Abre http://localhost:3000
