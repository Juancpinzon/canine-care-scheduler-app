# Guía de Despliegue y Configuración de Dominio - Q4 Paws

Esta guía detalla los pasos necesarios para configurar el dominio personalizado `q4paws.com` y asegurar que la aplicación funcione correctamente en producción.

## 1. Configuración del Dominio en Vercel

Para conectar el dominio `q4paws.com` a tu proyecto de Vercel:

1. Ve al **Vercel Dashboard**.
2. Selecciona tu proyecto (`canine-care-scheduler-app`).
3. Ve a **Settings** → **Domains**.
4. Escribe `q4paws.com` (o el dominio que elijas) y haz clic en **Add**.
5. Vercel te dará los registros DNS necesarios.

## 2. Configuración de Registros DNS

Debes entrar al panel de control de tu proveedor de dominio (donde compraste el dominio) y agregar los siguientes registros:

*   **Si usas el dominio raíz (q4paws.com):**
    *   **Tipo:** A
    *   **Nombre:** @
    *   **Valor:** 76.76.21.21
*   **Si usas un subdominio (ej: www.q4paws.com):**
    *   **Tipo:** CNAME
    *   **Nombre:** www
    *   **Valor:** cname.vercel-dns.com

*Nota: La propagación de DNS puede tardar hasta 48 horas, pero usualmente es más rápido.*

## 3. Configuración en Supabase Auth

Es CRÍTICO que Supabase permita redirecciones al nuevo dominio para que el inicio de sesión funcione:

1. Ve a tu proyecto en **Supabase Dashboard**.
2. Ve a **Authentication** → **URL Configuration**.
3. En **Site URL**, cámbialo a `https://q4paws.com`.
4. En **Redirect URLs**, agrega `https://q4paws.com/**`.
5. Haz clic en **Save**.

## 4. Variables de Entorno en Vercel

Asegúrate de que las variables de entorno en Vercel estén actualizadas:

1. En Vercel Dashboard, ve a **Settings** → **Environment Variables**.
2. Asegúrate de que `VITE_APP_URL` sea `https://q4paws.com`.
3. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` coincidan con los de tu proyecto de Supabase.

## 5. Verificación de PWA

Una vez desplegado:
*   Al abrir el sitio en Chrome (Android) o Safari (iOS), debería aparecer la opción de "Instalar aplicación" o "Agregar a la pantalla de inicio".
*   El icono y los colores de la barra de estado estarán configurados según la marca Q4 Paws.
