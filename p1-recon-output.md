# Phase 1: Reconnaissance Report (Full Stack)

**Application:** QuickDidi Platform  
**Targets:** 
- API Backend (`apps/api`)
- Web Frontend (`apps/web`)
- Mobile App (`apps/mobile`)
- Database & Auth (`Supabase / PostgreSQL`)
**Scope:** Entry points, sinks, authentication flows, data paths, and data models  

---

## 1. Architecture Overview

- **Backend Runtime:** Node.js / Express (v5) backend, TypeScript.
- **Frontend Framework:** Next.js (App Router, React 19).
- **Mobile Client:** React Native / Expo skeleton.
- **Database / Auth Provider:** Supabase (PostgreSQL with Auth GoTrue, Row-Level Security, RPCs, and Parameterized PostgREST queries).
- **Session Model:** Dual authentication tokens:
  - Ephemeral Access Token (JWT Bearer token, stored in frontend React state memory only, never written to `localStorage` or `sessionStorage`).
  - Refresh Token stored in an `HttpOnly`, `SameSite: strict`, scoped path (`/auth`) cookie (`refreshToken`).
- **Authorization Enforcement:** Middleware `requireAuth` validates the Bearer token against Supabase Auth (`supabase.auth.getUser(token)`). Role checks query `public.users` via `getUserRole(userId)`.

---

## 2. API Endpoints Map (100% Rate-Limited & Authenticated)

| Method | Endpoint | Auth Required | Rate Limiting | Purpose | Input Source |
|---|---|---|---|---|---|
| `GET` | `/health` | None | None | System diagnostics (sanitized in prod) | None |
| `POST` | `/auth/register` | None | `authRateLimit(8, 4)` | User sign-up (email/password) | `req.body` |
| `POST` | `/auth/login` | None | `authRateLimit(20, 6)` | User authentication | `req.body` |
| `POST` | `/auth/oauth-session` | None | `authRateLimit(15)` | Establishes session from OAuth callback | `req.body` |
| `POST` | `/auth/refresh` | None (Cookie) | `authRateLimit(45)` | Refreshes access token via refresh cookie | `req.cookies` |
| `GET` | `/auth/me` | Yes (`requireAuth`) | `authRateLimit(60)` | Retrieves current user profile | `req.headers.authorization` |
| `POST` | `/auth/logout` | Optional (`Bearer`) | `authRateLimit(30)` | Clears refresh cookie & invalidates token | `req.headers`, `req.cookies` |
| `POST` | `/auth/forgot-password`| None | `authRateLimit(8, 3)` | Sends password reset email | `req.body` |
| `POST` | `/auth/reset-password` | None | `authRateLimit(10)` | Consumes recovery token to set new password | `req.body` |
| `POST` | `/auth/google` | None | `authRateLimit(15)` | Verifies Google ID token with Supabase | `req.body` |
| `POST` | `/bookings` | Yes (`requireAuth`) | `bookingRateLimit(30)` | Creates new booking for customer | `req.body`, `req.userId` |
| `GET` | `/bookings` | Yes (`requireAuth`) | `bookingRateLimit(30)` | Lists bookings for authenticated customer | `req.userId` |
| `GET` | `/bookings/assigned` | Yes (`requireAuth` + role: `provider`)| `bookingRateLimit(30)` | Lists bookings assigned to provider | `req.userId` |
| `PATCH`| `/bookings/:id/response`| Yes (`requireAuth` + role: `provider`)| `bookingRateLimit(30)` | Accept or decline a booking | `req.params.id`, `req.body.decision`, `req.userId` |
| `POST` | `/providers/onboard` | Yes (`requireAuth`) | `apiRateLimit(60)` | Registers/updates provider profile & services | `req.body`, `req.userId` |
| `GET` | `/providers` | Optional | `apiRateLimit(60)` | Lists active providers filtered by service | `req.query.service_id` |
| `GET` | `/services` | None | `servicesRateLimit(60)` | Lists global service catalog | None |

---

## 3. User Input Vectors & Sinks

### 3.1 Authentication & Profile Inputs
- **`req.body.name`**: Trimmed string, length checked. Passed to Supabase Auth metadata (`full_name`).
- **`req.body.email`**: Trimmed string, normalized to lowercase in rate limiter. Passed to Supabase Auth `signUp`, `signInWithPassword`, and `resetPasswordForEmail`.
- **`req.body.password`**: Enforced minimum 8 characters. Passed to `signUp`, `signInWithPassword`, `updateUser`.
- **`req.body.token` / `refreshToken`**: Validation of token hash / recovery token for password resets.
- **`req.cookies.refreshToken`**: Read by `/auth/refresh` to refresh auth sessions.
- **`req.headers.authorization`**: Bearer token parsed and whitespace-trimmed by `requireAuth`, verified via Supabase API.

### 3.2 Bookings & Operations Inputs
- **`req.body.serviceId`**: Must match UUID format (`/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`). Sinks into `bookings` and `provider_services` query.
- **`req.body.providerId`**: Must match UUID format. Validated that `providerId !== req.userId`. Sinks into `bookings.insert`.
- **`req.body.requestId`**: Idempotency key. Must match UUID format. Checked via unique constraint `(customer_id, request_id)` on `public.bookings`.
- **`req.body.quantity`**: Must be integer between 1 and 10. Multiplied with verified server-side `unitPrice`.
- **`req.body.scheduledFor`**: Checked for ISO date parseability and strictly verified to be in the future (`Date.parse(scheduledFor) > Date.now()`).
- **`req.body.contactName`**: String ≤ 100 characters. Sinks into `users.upsert` and `bookings.insert`.
- **`req.body.phone`**: RegEx check (`/^[+0-9 ()-]{7,20}$/`). Sinks into `users.upsert` and `bookings.insert`.
- **`req.body.address`**: String ≤ 500 characters. Sinks into `bookings.insert`.
- **`req.params.id`**: Must match UUID format. Filtered on `bookings.id` where `provider_id = req.userId`.
- **`req.body.decision`**: Enforced enum `accept` | `decline`.

### 3.3 Provider Onboarding Inputs
- **`req.body.location`**: Trimmed string ≤ 200 characters.
- **`req.body.bio`**: Trimmed string ≤ 2000 characters.
- **`req.body.phone`**: RegEx check (`/^\+?[0-9]{7,15}$/`).
- **`req.body.services`**: Array of length 1..20; each object contains `service_id` and positive `custom_price`. Unique service IDs enforced via `Set`. Passed to database stored procedure `save_provider_application`.
- **`req.query.service_id`**: Optional query parameter. Sanitized with strict UUID regex before querying `provider_services`.

---

## 4. Frontend & Mobile Surface Audit

### 4.1 Frontend Client (`apps/web`)
- **Token Handling:** Access tokens are kept in volatile React context state memory (`auth-context.tsx`). No tokens stored in `localStorage` or `sessionStorage`.
- **Open Redirect Protection:** In `apps/web/src/app/(auth)/login/page.tsx`, the `from` query parameter is strictly checked against an explicit allowlist (`/checkout`, `/onboarding/provider`, `/my-appointments`). Arbitrary URLs and external protocols are rejected.
- **XSS Vector:** Standard React JSX data interpolation is used across appointment and booking views. No `dangerouslySetInnerHTML` instances exist.

### 4.2 Mobile Client (`apps/mobile`)
- React Native / Expo shell with no active backend API calls or leaked keys.

---

## 5. Database Queries Map (Data Sinks)

| Operation | Table / Function | Mechanism | Parameter Binding | Security Guard |
|---|---|---|---|---|
| User Creation | `auth.users` | Supabase Auth API (`auth.signUp`) | Parameterized | Passwords hashed with bcrypt by GoTrue |
| Profile Upsert | `public.users` | `supabase.from('users').upsert()` | Parameterized | Scoped to authenticated `req.userId` |
| Idempotency Query | `public.bookings` | `select('id, status, agreed_price')` | Parameterized | Filtered by `customer_id = req.userId` & `request_id` |
| Price Lookup | `public.provider_services` | `select('custom_price')` | Parameterized | Service price loaded from DB, client cannot tamper with price |
| Booking Insertion | `public.bookings` | `supabase.from('bookings').insert()` | Parameterized | Price calculated server-side (`unitPrice * quantity`) |
| Customer Booking Retrieval | `public.bookings` | `select('*')` | Parameterized | Strictly scoped: `.eq('customer_id', req.userId)` |
| Provider Booking Retrieval | `public.bookings` | `select('*')` | Parameterized | Strictly scoped: `.eq('provider_id', req.userId)` + role check |
| Booking Response | `public.bookings` | `update({ status })` | Parameterized | Scoped by `.eq('id', id).eq('provider_id', req.userId).eq('status', 'PENDING')` |
| Provider Application | `save_provider_application` | Database RPC (`supabase.rpc`) | Parameterized (JSONB) | `SECURITY DEFINER` function with `search_path = pg_catalog`, granted only to `service_role` |
| Provider Catalog Search | `public.provider_services` | `select(...)` | Parameterized | Filtered with validated UUID `service_id` |
| Global Services List | `public.global_services` | `select('*')` | None | Read-only public catalog |
