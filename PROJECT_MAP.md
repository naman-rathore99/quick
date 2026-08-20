# 🗺️ QuickDidi — Project Map

> **Last Updated:** August 21, 2026
> A complete reference guide for understanding the QuickDidi platform codebase.

---

## 📌 What is QuickDidi?

QuickDidi is a **home services marketplace** where customers can find and book verified cleaning, dusting, and cooking professionals ("Didis"). Think of it like Urban Company but focused on trusted home help.

---

## 🏗️ Architecture Overview

```
quickdidi-platform/          ← Turborepo Monorepo
├── apps/
│   ├── web/                 ← Next.js 15 Frontend (deployed on Vercel)
│   ├── api/                 ← Express.js Backend  (deploy on Render/Railway)
│   └── mobile/              ← React Native / Expo  (future)
├── package.json             ← Root workspace config
├── pnpm-lock.yaml           ← Lockfile
└── turbo.json               ← Turborepo build config
```

### Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 15, React 19, Tailwind CSS 4, shadcn/ui, Framer Motion |
| Backend     | Node.js, Express.js, TypeScript     |
| Database    | Supabase (PostgreSQL)               |
| Auth        | Supabase Auth (Google OAuth + Email/Password) |
| State       | Zustand (cart), React Context (auth) |
| Deployment  | Vercel (frontend), Render/Railway (backend) |

---

## 🔐 Authentication Flow

```
User clicks "Login" or "Sign in with Google"
        │
        ▼
   ┌─────────────┐     Google OAuth     ┌──────────────┐
   │  Frontend    │ ──────────────────►  │   Supabase   │
   │  (Next.js)   │ ◄──────────────────  │   Auth       │
   └─────────────┘   session token      └──────────────┘
        │
        │ API requests with token
        ▼
   ┌─────────────┐    verify token      ┌──────────────┐
   │  Backend     │ ──────────────────►  │   Supabase   │
   │  (Express)   │ ◄──────────────────  │   Database   │
   └─────────────┘   user data          └──────────────┘
```

- **Google Login:** Frontend uses `supabase.auth.signInWithOAuth()` → Supabase handles the entire flow
- **Email/Password:** Frontend calls backend `/auth/register` and `/auth/login` → Backend uses Supabase Admin auth

---

## 🗄️ Database Schema (Supabase)

```
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│     users         │     │  global_services   │     │    bookings       │
├──────────────────┤     ├───────────────────┤     ├──────────────────┤
│ id (uuid)         │     │ id (uuid)          │     │ id (uuid)         │
│ name              │     │ name               │     │ customer_id (FK)  │
│ phone             │     │ description        │     │ provider_id (FK)  │
│ role              │     └───────────────────┘     │ service_id (FK)   │
│ location          │                                │ scheduled_for     │
│ is_verified       │     ┌───────────────────┐     │ agreed_price      │
│ created_at        │     │ provider_services  │     │ status            │
└──────────────────┘     ├───────────────────┤     │ payment_status    │
                          │ id (uuid)          │     └──────────────────┘
                          │ provider_id (FK)   │
                          │ service_id (FK)    │     ┌──────────────────┐
                          │ bundle_name        │     │    messages       │
                          │ custom_price       │     ├──────────────────┤
                          │ bio                │     │ id (uuid)         │
                          └───────────────────┘     │ booking_id (FK)   │
                                                     │ sender_id (FK)    │
                                                     │ content           │
                                                     └──────────────────┘
```

---

## 📂 Frontend File Map (`apps/web/`)

### Pages (Routes)

| Route                    | File                                      | Purpose                        |
|--------------------------|-------------------------------------------|--------------------------------|
| `/`                      | `src/app/page.tsx`                        | Homepage (all sections)        |
| `/login`                 | `src/app/(auth)/login/page.tsx`           | Login form + Google auth       |
| `/signup`                | `src/app/(auth)/signup/page.tsx`          | Registration form              |
| `/partner`               | `src/app/(auth)/partner/page.tsx`         | Provider recruitment landing   |
| `/onboarding/provider`   | `src/app/onboarding/provider/page.tsx`    | Multi-step provider onboarding |
| `/checkout`              | `src/app/checkout/page.tsx`               | Booking checkout               |
| `/forgot-password`       | `src/app/forgot-password/page.tsx`        | Password reset request         |
| `/reset-password`        | `src/app/reset-password/page.tsx`         | Password reset form            |

### Homepage Sections (in order)

| Component                  | File                                                    | Description                          |
|----------------------------|---------------------------------------------------------|--------------------------------------|
| `Hero`                     | `src/features/home/components/Hero.tsx`                 | Title + interactive booking widget   |
| `MeetDidisSection`         | `src/features/home/components/MeetDidisSection.tsx`     | Top-rated provider cards             |
| `ServicesSection`          | `src/features/services/components/ServicesSection.tsx`  | Service catalog grid                 |
| `HowItWorksSection`       | `src/features/home/components/HowItWorksSection.tsx`    | 4-step timeline                      |
| `WhyChooseUsSection`      | `src/features/home/components/WhyChooseUsSection.tsx`   | Trust features grid                  |
| `TestimonialsSection`     | `src/features/home/components/TestimonialsSection.tsx`  | Customer reviews                     |
| `CtaSection`              | `src/features/home/components/CtaSection.tsx`           | Final call-to-action banner          |

### Shared Components

| Component              | File                                          | Purpose                       |
|------------------------|-----------------------------------------------|-------------------------------|
| `Navbar`               | `src/components/layout/Navbar.tsx`            | Top nav + theme toggle        |
| `Footer`               | `src/components/layout/Footer.tsx`            | Site footer                   |
| `GoogleAuthButton`     | `src/components/auth/google-auth-button.tsx`  | Google OAuth via Supabase     |
| `CartSheet`            | `src/features/cart/components/CartSheet.tsx`   | Booking cart sidebar          |
| `ThemeProvider`        | `src/components/theme-provider.tsx`           | Dark/light mode wrapper       |

### Key Config & Utility Files

| File                            | Purpose                                    |
|---------------------------------|--------------------------------------------|
| `context/auth-context.tsx`      | React context for auth state management    |
| `src/lib/auth-api.ts`          | API client for backend auth endpoints      |
| `src/lib/design-system.ts`     | Tailwind class tokens (layout, typography) |
| `src/stores/cart-store.ts`     | Zustand store for booking cart             |
| `utils/supabase/client.ts`     | Supabase browser client                    |
| `next.config.ts`               | Next.js configuration                      |
| `vercel.json`                  | Vercel deployment config                   |
| `src/app/globals.css`          | CSS variables (theme colors)               |

---

## 📂 Backend File Map (`apps/api/`)

### API Routes

| Method | Endpoint               | File                          | Purpose                           |
|--------|------------------------|-------------------------------|-----------------------------------|
| POST   | `/auth/register`       | `src/routes/auth.ts`          | Register new user                 |
| POST   | `/auth/login`          | `src/routes/auth.ts`          | Login with email/password         |
| POST   | `/auth/refresh`        | `src/routes/auth.ts`          | Refresh access token              |
| POST   | `/auth/logout`         | `src/routes/auth.ts`          | Logout (clear cookie)             |
| GET    | `/auth/me`             | `src/routes/auth.ts`          | Get current user profile          |
| POST   | `/auth/google`         | `src/routes/google.ts`        | Google OAuth token exchange       |
| GET    | `/services`            | `src/routes/services.ts`      | List all global services          |
| GET    | `/bookings`            | `src/routes/bookings.ts`      | Get user's bookings               |
| POST   | `/bookings`            | `src/routes/bookings.ts`      | Create new booking                |
| POST   | `/providers/onboard`   | `src/routes/providers.ts`     | Provider registration + services  |
| GET    | `/providers`           | `src/routes/providers.ts`     | List providers (with filters)     |
| GET    | `/health`              | `src/index.ts`                | Health check for monitoring       |

### Key Backend Files

| File                               | Purpose                               |
|------------------------------------|---------------------------------------|
| `src/index.ts`                     | Express app setup, route mounting     |
| `src/lib/db.ts`                   | Supabase client (admin + public)      |
| `src/middleware/requireAuth.ts`    | JWT verification middleware           |
| `src/lib/jwt.ts`                  | JWT helper utilities                  |
| `src/lib/email.ts`                | Email sending (password reset)        |

---

## 🌍 Environment Variables

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://kakpqltirmbgremokzwj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Backend (`apps/api/.env`)
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://kakpqltirmbgremokzwj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-secret-key>
```

### Vercel (Environment Variables in Dashboard)
```
ENABLE_EXPERIMENTAL_COREPACK=1
NEXT_PUBLIC_SUPABASE_URL=<same as above>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same as above>
```

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies (from root)
pnpm install

# 2. Start backend (port 4000)
cd apps/api
pnpm run dev

# 3. Start frontend (port 3000) — in a new terminal
cd apps/web
pnpm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 🎨 Theme System

The app uses CSS variables defined in `apps/web/src/app/globals.css`. The primary color is a **coral red** (`oklch(0.62 0.22 30)`).

To change the theme color, edit the `--primary` variable in both `:root` (light mode) and `.dark` (dark mode) sections of `globals.css`.

The Navbar has a **Sun/Moon toggle** button for switching between light and dark mode.

---

## 📱 Provider Onboarding Flow

```
/partner (landing page)
    │  "Apply Now" button
    ▼
/onboarding/provider (multi-step form)
    │  Step 1: Personal info (name, phone, location)
    │  Step 2: Select services + set custom prices/bundles
    │  Step 3: Bio + confirm
    ▼
POST /providers/onboard (backend)
    │  Updates user role to 'provider'
    │  Creates provider_services entries
    ▼
Dashboard (future)
```

---

## 📋 What's Built vs What's Next

### ✅ Done
- Full homepage redesign (7 sections)
- Interactive booking widget in Hero
- Provider profiles section (Meet Didis)
- Supabase backend integration
- Google OAuth via Supabase
- Email/Password auth
- Provider onboarding flow
- Service catalog with booking
- Dark/light mode toggle
- Vercel deployment config
- Health check endpoint

### 🔜 Next Steps
- Provider Dashboard (view bookings, manage schedule)
- Customer Dashboard (track bookings, messages)
- Real-time messaging between customer and provider
- Payment integration (Razorpay/Stripe)
- Location-based provider search
- Push notifications
- Mobile app (React Native / Expo)
