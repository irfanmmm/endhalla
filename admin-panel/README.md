# Endhalla Admin Panel

A React + TypeScript (Vite) single-page dashboard for operating the Endhalla platform.
It talks to the dedicated **admin API** at `backend/src/admin`.

## Features

| Area | What you can do |
| --- | --- |
| **Dashboard** | User / client / counsellor / booking totals, gross & 30-day revenue, 14-day bookings & revenue charts, session-type split, recent activity |
| **Approvals** | Queue of counsellors awaiting review (sidebar badge shows the count); approve or reject with an optional internal reason |
| **Counsellors** | Search / filter by approval status / sort, edit every profile field & rates, approve / reject, delete, per-counsellor booking summary. Counsellors are **not** created here — they self-register through the counsellor app |
| **Users** | Search / filter clients & counsellors, edit name / gender, view booking history & spend, delete (also removes linked counsellor profile) |
| **Bookings** | Filter by status / payment / type / free-text, change status & payment status, edit notes, delete, matched-revenue total |
| **Payments** | Razorpay-backed bookings with order / payment IDs, filter by payment status |
| **Settings** | View account, change password |

Auth is JWT (Bearer) with a bcrypt-hashed `Admin` model. All `/api/admin/*` routes
except `POST /auth/login` require a valid admin token.

### Counsellor approval flow

Counsellors register in the counsellor app and land as `approvalStatus: 'pending'`.
Only `approved` counsellors are returned by the client API (`GET /api/counsellors`).
An admin approves or rejects them from the panel; a rejected counsellor can be
approved later. Run `npm run migrate:approval` in `backend/` once to backfill
`approvalStatus` on counsellors created before this field existed.

## Design

- Teal accent, full light + dark mode driven by CSS variables in `src/index.css`
  (follows the OS `prefers-color-scheme`).
- `lucide-react` icon set; `recharts` for the dashboard charts (restyled — thin
  single-hue marks, recessive axes).
- Toast notifications (`src/context/ToastContext.tsx`) for save/delete feedback,
  skeleton loaders and empty states while lists load, sticky action bars on the
  edit screens.
- Two type weights, sentence case throughout.

## Running locally

### 1. Backend admin API

```bash
cd backend
npm install
npm run seed:admin      # creates admin@endhalla.com / ChangeMe123! (override via .env)
npm run dev:admin       # http://localhost:5003
```

Relevant `.env` keys (see `backend/.env`):

```
ADMIN_PORT=5003
ADMIN_JWT_SECRET=...          # change in production
ADMIN_JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@endhalla.com
ADMIN_PASSWORD=ChangeMe123!
ADMIN_NAME=Super Admin
```

### 2. Admin panel

```bash
cd admin-panel
npm install
npm run dev             # http://localhost:5173
```

The dev server proxies `/api` → `http://localhost:5003` (configurable with the
`VITE_ADMIN_API` env var). For a production build set `VITE_API_BASE` to the
deployed admin API origin and run `npm run build` (output in `dist/`).

## API surface (`/api/admin`)

```
POST   /auth/login                 { email, password } -> { token, admin }
GET    /auth/me
PUT    /auth/password               { currentPassword, newPassword }

GET    /dashboard/overview
GET    /dashboard/activity

GET    /counsellors                 ?q &status=pending|approved|rejected &onboarding &sortBy &page &limit
GET    /counsellors/pending/count   -> { count }   (sidebar badge)
GET    /counsellors/:id
PUT    /counsellors/:id              profile fields only (no approval, no creation)
PATCH  /counsellors/:id/approval    { decision: 'approved'|'rejected'|'pending', reason? }
DELETE /counsellors/:id             ?deleteUser=true

GET    /users                       ?q &userType &page &limit
GET    /users/:id
PUT    /users/:id
DELETE /users/:id

GET    /bookings                    ?q &status &paymentStatus &sessionType &counsellorId &clientPhone &from &to &page &limit
GET    /bookings/payments/list      ?paymentStatus &paymentMethod &page &limit
GET    /bookings/:id
PATCH  /bookings/:id                { status, paymentStatus, notes, dateText, timeText }
DELETE /bookings/:id
```
