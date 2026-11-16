# Exotica Watches

A full-stack storefront for a curated luxury-watch catalogue: public product browsing,
Google sign-in, a Stripe test-mode checkout with server-verified pricing, and a
role-protected admin dashboard for inventory management.

**Live demo:** _add your Vercel URL here_
**Stack:** Next.js 15 (App Router) · TypeScript · Prisma/MySQL · Auth.js (NextAuth v5) · Stripe · Cloudinary · MUI

> This is a portfolio/demo project. Payments run in Stripe **test mode**; no real orders
> are fulfilled.

## Screenshots

_Add screenshots or a short GIF to `docs/` and reference them here. Recruiters look at
the README before they read a single line of code._

| Storefront | Product page | Checkout | Admin dashboard |
| --- | --- | --- | --- |
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

## Features

- **Storefront** — server-rendered product grid, text search, category filter and
  paginated results.
- **Authentication** — Google OAuth via Auth.js with database sessions. Roles are stored
  on the user record; admins are provisioned through the `ADMIN_EMAILS` allowlist.
- **Admin dashboard** — product CRUD, image uploads to Cloudinary, stock status derived
  from quantity, low-stock analytics.
- **Checkout** — Stripe Payment Element. The payment amount is computed **server-side**
  from the database, an order is persisted before the intent is created, and a webhook is
  the only thing that marks an order as paid.
- **Guardrails** — every admin page, API route and server action checks the session and
  role; all mutation input is validated with Zod.
- **Quality** — 30 unit/integration tests, strict TypeScript, ESLint and a GitHub Actions
  pipeline that runs lint, typecheck, tests and a production build.

## Architecture

```
src/
├── app/
│   ├── (store)/                 # public storefront + checkout (own layout/header)
│   │   ├── page.tsx             # catalogue with search, filter, pagination
│   │   ├── signIn/page.tsx
│   │   ├── product/[productId]/
│   │   │   ├── page.tsx         # product detail
│   │   │   └── order/page.tsx   # auth-protected checkout entry
│   │   └── payment-success/     # verifies the PaymentIntent server-side
│   ├── (admin)/                 # role-protected admin area (own layout/sidebar)
│   │   ├── admin/               # dashboard, create, edit, view
│   │   └── analytics/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # Auth.js route handler
│   │   ├── create-payment-intent/
│   │   └── webhooks/stripe/     # signature-verified webhook
│   ├── error.tsx / loading.tsx / not-found.tsx / sitemap.ts / robots.ts
│   └── layout.tsx
├── auth.ts                      # Auth.js configuration
├── db/index.ts                  # Prisma singleton
├── lib/
│   ├── actions/                 # server actions (products, auth)
│   ├── auth-guards.ts           # requireUser / requireAdmin (page vs action guards)
│   ├── cloudinary.ts            # signed uploads + best-effort deletion
│   ├── env.ts                   # Zod-validated environment
│   ├── money.ts                 # all price maths in integer cents
│   ├── orders.ts                # order creation + idempotent paid/failed transitions
│   ├── products.ts              # read queries / DTO mapping
│   ├── stock.ts                 # derived stock status
│   └── validation.ts            # Zod schemas shared by forms and routes
├── components/                  # MUI components, grouped by store/admin
└── types/                       # domain types + next-auth augmentation
```

### Checkout & payment flow

1. The shopper opens `/product/:id/order`. The server looks up the product, rejects
   out-of-stock items and passes only display data to the client.
2. `POST /api/create-payment-intent` requires a session, accepts `{ productId, quantity }`
   (never a price), validates it, re-reads the product and creates a `PENDING` order.
3. Stripe is called with `amount = order.totalCents` and `metadata.orderId`.
4. The client confirms the payment with Stripe Elements.
5. Stripe calls `POST /api/webhooks/stripe`. The handler verifies the signature and
   idempotently transitions the order to `PAID`, decrementing stock in a transaction.
6. `/payment-success?payment_intent=…` retrieves the intent from Stripe **server-side**
   and only shows order details that belong to the signed-in user.

## Getting started

### Prerequisites

- Node.js 20+
- MySQL 8+ (or a hosted MySQL-compatible database)
- Cloudinary account
- Google OAuth credentials
- Stripe account (test mode)

### Setup

```bash
git clone <your-repo-url>
cd Sanka-47-Exotic-Watches-NextJ
npm install
cp .env.example .env        # fill in the values below
npx prisma migrate deploy   # or: npx prisma migrate dev
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | MySQL connection string |
| `NEXTAUTH_SECRET` | yes | Auth.js session encryption (32+ random bytes) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | yes | Google OAuth app |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | yes | Image storage |
| `CLOUDINARY_UPLOAD_FOLDER` | no | Folder for product images (default `exotica-watches`) |
| `STRIPE_SECRET_KEY` | yes | Stripe server key (`sk_test_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | yes | Stripe publishable key (`pk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | yes for fulfilment | Webhook signing secret (`whsec_…`) |
| `ADMIN_EMAILS` | no | Comma-separated Google emails promoted to `ADMIN` |
| `NEXT_PUBLIC_APP_URL` | no | Canonical URL (default `http://localhost:3000`) |

Generate a secret with `openssl rand -base64 32`.

### Stripe webhook locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_… into STRIPE_WEBHOOK_SECRET
```

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### Data

Product categories are not seeded automatically. Create rows in the `Categories` table
(or add a seed script) before creating products, then sign in with an address listed in
`ADMIN_EMAILS` to access `/admin`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit/integration tests |
| `npm run test:e2e` | Playwright suite (requires `E2E_BASE_URL`) |
| `npm run format` | Prettier |

## Security notes

- **Authorization is server-side.** `requireAdmin`/`requireUser` guard server actions,
  API routes, the admin layout **and every admin page** (layouts and pages render in
  parallel, so the page-level check prevents data fetching before the redirect). The admin
  layout redirects unauthenticated and non-admin users.
- **Prices are never trusted from the client.** Only `productId` and `quantity` cross the
  network; the server computes cents from the database.
- **Payments are verified, not assumed.** The success page retrieves the PaymentIntent
  from Stripe, and fulfilment happens in the webhook using the Stripe signature.
- **Uploads are constrained** to JPEG/PNG/WebP/AVIF, max 5 MB, max 3 images per product.
- **Input validation** uses Zod schemas at every mutation boundary.
- **Cloudinary cleanup is best-effort** and runs after the database change, so a failed
  delete cannot leave dangling image references.
- **Environment variables** are validated at boot with a readable error list.

## Testing

```bash
npm test          # 30 tests: money, validation, stock, Cloudinary URLs, auth guards,
                  # and an authorization test proving productDelete never reaches the DB
npm run test:e2e  # Playwright smoke tests, skipped unless E2E_BASE_URL is set
```

CI (`.github/workflows/ci.yml`) runs lint → typecheck → unit tests → production build on
every push and pull request.

## Known limitations / roadmap

- Single-item orders (quantity is capped at 5, no cart).
- Categories must be created directly in the database; there is no category CRUD UI.
- Cloudinary public ids are derived from URLs rather than stored separately; transformed
  delivery URLs are not supported for deletion.
- Analytics widgets use sample data rather than aggregates from the order table.
- No e-mail receipts, refunds or shipping integration.
- Product images are three nullable URL columns rather than a normalized `ProductImage`
  table.

## License

MIT — use it, learn from it, improve it.

## Author

Kalindu Koanara · [LinkedIn](https://www.linkedin.com/in/kalindu-koanara47/)
