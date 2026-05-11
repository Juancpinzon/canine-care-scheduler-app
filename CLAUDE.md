# CLAUDE.md — Q4 Paws Dog Grooming

## App de agendamiento para peluquería canina de lujo en Kissimmee, FL

> **Leer completo antes de tocar cualquier archivo.** Este documento es la fuente de verdad. Si algo contradice este doc, este doc gana.

---

## 🧠 Contexto del Negocio

**Q4 Paws Dog Grooming** — peluquería canina premium en Kissimmee, Florida.  
Atiende principalmente a la comunidad hispana de Osceola County.

| Dato | Valor |
|------|-------|
| Nombre | Q4 Paws Dog Grooming |
| Email | q4pawsdg@gmail.com |
| Teléfono | +1 321-318-87-60 |
| Instagram | @q4paws |
| Ciudad | Kissimmee, FL |
| Timezone | America/New_York (ET) |
| Idioma UI | Español |

**Problema central:** coordinación manual de citas (WhatsApp/teléfono), sin historial de mascotas, sin recordatorios automáticos, sin métricas de negocio.

---

## 🎯 Principios de Diseño Irrompibles

1. **Una cita no puede quedar en el aire** — Si se inicia un agendamiento, debe completarse o cancelarse. Nunca status ambiguo.
2. **La dueña siempre tiene control total** — Admin puede override cualquier acción del cliente.
3. **Cada perro tiene su identidad** — Los perros son entidades primarias con historial independiente.
4. **Nada táctil menor a 56px en mobile** — Toda acción crítica operable con el pulgar sin zoom.
5. **Sin datos completos, sin cita** — Validar mascota + servicio + slot + contacto antes de confirmar.

---

## 🎨 Sistema de Diseño — Dark Luxury

### Paleta (aprobada por Sophia)
```css
/* Fondos */
--bg-base:       #080808;   /* negro profundo — fondo principal */
--bg-surface:    #0C0C0C;   /* negro ligeramente más claro — secciones alt */
--bg-card:       #080808;   /* cards */
--bg-card-hover: #0F0F0F;   /* hover de cards */
--bg-footer:     #040404;

/* Dorado — color principal de marca */
--gold:          #C9A84C;   /* acción, títulos destacados, CTAs */
--gold-muted:    rgba(201,168,76,0.35);  /* números decorativos, borders */
--gold-subtle:   rgba(201,168,76,0.08);  /* fondos muy sutiles */

/* Texto */
--text-primary:  #F0EDE8;   /* blanco cálido */
--text-muted:    rgba(240,237,232,0.38); /* descripiciones */
--text-subtle:   rgba(240,237,232,0.22); /* detalles, footer */

/* Bordes */
--border-gold:   rgba(201,168,76,0.12);
--border-subtle: rgba(255,255,255,0.07);
```

### Tipografía
```css
/* Display — títulos, hero, nombres de servicios */
font-family: 'Cormorant Garamond', serif;
/* Google Fonts: ?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400 */

/* Body — UI general, labels, botones */
font-family: 'DM Sans', sans-serif;
/* Google Fonts: ?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500 */
```

### Clases CSS Existentes en tailwind.config.ts
```
Las clases spawblue/spawgreen del proyecto original quedan en el archivo
pero NO se usan en el diseño nuevo — todo el diseño usa inline styles
con la paleta dorado/negro definida arriba.
```

### Reglas Touch Mobile
- Botones principales: mínimo `h-14` (56px)
- Items táctiles de lista: mínimo `py-4`
- Fuente mínima: 12px en UI, nunca menos

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.3.1 |
| Lenguaje | TypeScript | 5.5.3 |
| Build | Vite + plugin-react-swc | 5.4.1 |
| Styling | Tailwind CSS | 3.4.11 |
| UI Components | shadcn/ui (Radix UI) | slate base |
| Backend | Supabase JS | 2.49.8 |
| Data fetching | TanStack Query | v5.56.2 |
| Routing | react-router-dom | 6.26.2 |
| Forms | react-hook-form + zod | 7.53 / 3.23 |
| Estado global | Zustand | 5.0.4 |
| Charts | Recharts | 2.12.7 |
| Calendar UI | react-day-picker | 8.10.1 |
| Fechas | date-fns | 3.6.0 |
| Toast | Sonner | 1.5.0 |
| Package manager | Bun | — |

### Supabase
- **Proyecto:** grooming
- **Project ID:** lbuidahoullyfahhkupr
- **URL:** https://lbuidahoullyfahhkupr.supabase.co
- **Region:** us-west-1 (North California)

---

## 📁 Estructura del Proyecto

```
canine-care-scheduler-app/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui — NO modificar
│   │   ├── layout/                # Header, Sidebar, MobileNav
│   │   ├── appointments/          # CalendarView, AppointmentCard, BookingWizard
│   │   ├── dogs/                  # DogProfile, DogCard, DogForm
│   │   ├── clients/               # ClientCard, ClientSearch, ClientForm
│   │   ├── services/              # ServiceCard, PriceDisplay
│   │   └── admin/                 # DashboardStats, DailyView, ReportChart
│   ├── pages/
│   │   ├── Landing.tsx            # / — dark luxury landing (YA REEMPLAZADA)
│   │   ├── public/                # /reservar — wizard de booking
│   │   ├── client/                # Portal cliente (auth requerida)
│   │   └── admin/                 # Panel admin (role='admin')
│   ├── hooks/                     # Único punto de acceso a Supabase
│   │   ├── useAppointments.ts
│   │   ├── useDogs.ts
│   │   ├── useClients.ts
│   │   ├── useServices.ts
│   │   ├── useAvailability.ts
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── utils.ts               # cn() de shadcn
│   │   ├── formatters.ts          # formatDate (ET), formatCurrency
│   │   └── constants.ts
│   └── types/index.ts
├── supabase/migrations/
├── index.html                     # lang="es", title="Q4 Paws | Dog Grooming Kissimmee"
├── tailwind.config.ts
├── components.json
└── CLAUDE.md
```

---

## 💾 Schema de Base de Datos

```typescript
interface Profile {
  id: string                    // = auth.users.id
  role: 'admin' | 'client'
  full_name: string
  phone?: string
  preferred_language: 'es' | 'en'
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

interface Dog {
  id: string
  owner_id: string              // FK → profiles.id
  name: string
  breed: string
  size: 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'
  sex: 'male' | 'female'
  is_neutered: boolean
  date_of_birth?: Date
  weight_lbs?: number
  color?: string
  photo_url?: string
  vet_name?: string
  vet_phone?: string
  allergies?: string
  medical_notes?: string
  vaccination_rabies_date?: Date
  vaccination_bordetella_date?: Date
  vaccination_dhpp_date?: Date
  is_dog_friendly: boolean
  is_human_friendly: boolean
  behavior_notes?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

interface Service {
  id: string
  name: string
  description?: string
  duration_minutes: number
  // Precios por tamaño (USD)
  price_xs: number
  price_small: number
  price_medium: number
  price_large: number
  price_xl: number
  price_xxl: number
  is_active: boolean
  sort_order: number
  created_at: Date
}

interface BusinessSchedule {
  id: string
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6
  is_open: boolean
  open_time: string             // "09:00"
  close_time: string            // "17:00"
  max_concurrent_appointments: number
}

interface BlockedDate {
  id: string
  date: Date
  reason?: string
  created_at: Date
}

interface Appointment {
  id: string
  client_id: string
  dog_id: string
  service_id: string
  scheduled_date: Date
  scheduled_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  price_charged_usd: number
  notes_client?: string
  notes_admin?: string
  groomer_notes?: string
  before_photo_url?: string
  after_photo_url?: string
  reminder_24h_sent: boolean
  reminder_2h_sent: boolean
  created_at: Date
  updated_at: Date
}

interface AppointmentStatusHistory {
  id: string
  appointment_id: string
  old_status: string
  new_status: string
  changed_by: string
  reason?: string
  created_at: Date
}
```

---

## 💰 Precios Reales (Seed Data)

### Servicios principales

| Servicio | XS | S | M | L | XL | XXL | Duración |
|----------|-----|-----|-----|-----|------|------|----------|
| Full Groom | $65 | $65 | $85 | $100 | $125 | $140 | 120 min |
| Minigroom | $50 | $50 | $60 | $100 | $110 | $130 | 60 min |
| Luxury Bath | $45 | $45 | $50 | $60 | $65 | $70 | 90 min |

### Add-ons (tabla `service_addons`)

| Add-on | Precio |
|--------|--------|
| Hand Scissoring | $11/min |
| Hand Stripping | $50/hr |
| Exotic Groom | $25 |
| Spa Bath | +$10 |
| Specialty Shampoo | +$3 |
| Anal Glands | $5 |

### Walk-ins

| Servicio | Precio |
|----------|--------|
| Nail Band | $20 |
| Paw Thin / Peel Thin | ~$15 |
| Ear Clean | $12 |
| Anal Glands | $10 |

### Horarios iniciales

| Día | Apertura | Cierre | Capacidad |
|-----|----------|--------|-----------|
| Lunes–Viernes | 9:00 am | 5:00 pm | 4 simultáneas |
| Sábado | 9:00 am | 3:00 pm | 3 simultáneas |
| Domingo | Cerrado | — | — |

---

## 🖥️ Pantallas y Navegación

```
PÚBLICO (sin auth)
├── /                  Landing dark luxury (✅ HECHA)
├── /reservar          Wizard de booking (4 pasos)
├── /login             Auth
└── /registro          Registro

PORTAL CLIENTE (role='client')
├── /mis-citas         Próximas + historial
├── /mis-perros        Ver, agregar, editar
└── /perfil            Datos personales

PANEL ADMIN (role='admin')
├── /admin             Dashboard diario — vista de HOY
├── /admin/calendario  Vista semanal/mensual
├── /admin/citas       Lista + filtros
├── /admin/clientes    Directorio de clientes
├── /admin/mascotas    Directorio de perros
├── /admin/servicios   Gestión de precios y servicios
├── /admin/horarios    Horarios + días cerrados
└── /admin/reportes    Ingresos, servicios populares
```

---

## ⚙️ Variables de Entorno (.env.local)

```bash
VITE_SUPABASE_URL=https://lbuidahoullyfahhkupr.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_qVs5u8...   # key completa

RESEND_API_KEY=re_...   # para emails de confirmación y recordatorios

VITE_BUSINESS_NAME="Q4 Paws Dog Grooming"
VITE_BUSINESS_EMAIL="q4pawsdg@gmail.com"
VITE_BUSINESS_PHONE="+13213188760"
VITE_BUSINESS_INSTAGRAM="@q4paws"
VITE_TIMEZONE="America/New_York"
```

---

## 🔒 Supabase RLS Policies

```sql
-- profiles:  owner ve solo el suyo; admin ve todos
-- dogs:      owner_id = auth.uid() OR role = 'admin'
-- appointments: client_id = auth.uid() OR role = 'admin'
-- services:  SELECT público; write solo admin
-- business_schedules: SELECT público; write solo admin
-- blocked_dates: SELECT público; write solo admin
```

---

## 🚀 Fases de Construcción

### ✅ Fase 1: Landing (COMPLETA)
- Landing dark luxury con diseño aprobado por Sophia

### Fase 2: DB + Auth (próximo — 1 crédito Lovable)
- [ ] Migraciones SQL con schema completo
- [ ] Trigger on_auth_user_created → profiles
- [ ] RLS en todas las tablas
- [ ] Seed: servicios Q4 Paws + horarios reales
- [ ] Perfil admin inicial: q4pawsdg@gmail.com, role='admin'
- [ ] ✅ Criterio: Sophia puede loguearse y ver el dashboard

### Fase 3: Dashboard Admin — Vista Diaria (1 crédito)
- [ ] /admin — lista de citas de HOY ordenada por hora
- [ ] Datos visibles: perro, dueño, teléfono, servicio, precio
- [ ] Acciones: Confirmar / En progreso / Completar / No show
- [ ] Crear cita manual desde admin
- [ ] ✅ Criterio: Sophia ve su día y puede gestionar cada cita

### Fase 4: Wizard de Reserva (1 crédito)
- [ ] /reservar — 4 pasos: Servicio → Perro → Fecha+Hora → Confirmación
- [ ] useAvailability: slots reales cruzando horarios + citas existentes
- [ ] Email de confirmación (Resend)
- [ ] Notificación a Sophia (email)
- [ ] ✅ Criterio: cliente externo agenda sin login, Sophia recibe email

### Fase 5: Perfiles de Mascotas + Portal Cliente (1 crédito)
- [ ] /mis-perros — agregar perro con foto, raza, tamaño, salud, comportamiento
- [ ] /mis-citas — historial + próximas
- [ ] Perfil del perro con historial de servicios
- [ ] ✅ Criterio: cliente ve sus perros e historial completo

---

## 🚨 Reglas de Código

### SIEMPRE
- TypeScript strict. Sin `any` explícito
- Queries a Supabase **solo** en hooks de `/hooks/`
- Fechas en UTC en DB; formatear en `America/New_York` para mostrar
- Diseño: usar variables CSS del sistema de diseño dark luxury
- UI **siempre en español** (labels, errores, mensajes)
- Validar disponibilidad con `useAvailability` antes de crear cita
- RLS activo en todas las tablas

### NUNCA
- `service_role_key` en el cliente — solo en Edge Functions
- Queries Supabase fuera de `/hooks/`
- Borrar citas físicamente — cambiar status a 'cancelled'
- Asumir timezone — usar `VITE_TIMEZONE`
- Hardcodear precios — siempre desde la DB

---

## 📋 Comandos

```bash
bun install
bun run dev
bun run build
supabase db push
supabase gen types typescript --local > src/types/supabase.ts
```

---

## 🔮 Roadmap Futuro

| Feature | Cuándo |
|---------|--------|
| Pagos online Stripe | Cuando tenga cuenta bancaria business |
| Chatbot WhatsApp | Con 30+ clientes activos |
| Galería pública before/after | Con 50+ fotos con permiso |
| SMS recordatorios | Si email tiene baja apertura |
| Loyalty / descuentos | Con base de clientes establecida |
| Reviews y calificaciones | Con 20+ clientes activos |
