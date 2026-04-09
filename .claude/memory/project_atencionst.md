---
name: AtencionST — Sistema de Reseñas Thermomix
description: Context for the AtencionST review system project
type: project
---

Sistema de reseñas para servicio técnico Thermomix. Permite a clientes dejar calificación (1-5 estrellas) y comentario, y opcionalmente ir a Google Reviews.

**Why:** El negocio no tenía forma de medir satisfacción del cliente. Acceso vía QR/NFC.

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel

**Páginas:**
- `/review` → formulario público (destino del QR/NFC)
- `/gracias` → post-envío, botón a Google Reviews (solo si rating >= 4)
- `/admin` → dashboard con stats y tabla (protegido con cookie de sesión)
- `/admin/login` → login con contraseña

**How to apply:** El usuario tiene experiencia técnica avanzada. Preferir soluciones completas sin simplificaciones.

**Pendiente:**
- Configurar Supabase (ver SETUP.md)
- Agregar URL de Google Reviews en .env.local
- Deploy en Vercel
- Generar QR y programar tags NFC
