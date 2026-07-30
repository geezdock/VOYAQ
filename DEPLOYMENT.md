# Deployment

## Prerequisites

- Node.js 20+
- npm
- A [Vercel](https://vercel.com) account (recommended) or any Node.js hosting
- External services (see below)

## Environment Variables

| Variable | Required | Source | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project settings | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase project settings | Anonymous key |
| `GEMINI_API_KEY` | No | Google AI Studio | AI itinerary, budget, and tips |
| `NEXT_PUBLIC_DEV_AUTH` | No | — | Set to `true` for dev only |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry project settings | Error tracking |
| `SENTRY_ORG` | No* | Sentry | Required if Sentry is configured |
| `SENTRY_PROJECT` | No* | Sentry | Required if Sentry is configured |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Console | Persistent caching |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Console | Required if URL is set |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog project settings | Product analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog project settings | API host |

*\* Required only if `NEXT_PUBLIC_SENTRY_DSN` is set.*

## Deploy to Vercel

### 1. Prepare

```bash
# Install dependencies
npm install

# Build locally to verify
npm run build
```

### 2. Connect Repository

- Push to GitHub
- Import repo in Vercel
- Framework preset: **Next.js**
- Build command: `npm run build`
- Output directory: `.next`

### 3. Configure Environment

Add all environment variables from the table above in Vercel's project settings.

### 4. Deploy

Vercel auto-deploys on push to `main`. For manual deploy:

```bash
npx vercel --prod
```

## Post-Deployment Checklist

- [ ] Build passes cleanly (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] TypeScript check passes (`npm run typecheck`)
- [ ] All tests pass (`npm test`)
- [ ] Homepage loads and is interactive
- [ ] Auth flow works (sign in, redirect, session persistence)
- [ ] Middleware redirects unauthenticated users to `/auth`
- [ ] Security headers are present (check browser DevTools > Network > Response Headers):
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
- [ ] `robots.txt` returns expected rules
- [ ] `sitemap.xml` contains all public routes
- [ ] `/sw.js` serves a valid service worker
- [ ] Sentry receives events (if configured) — trigger a test error
- [ ] PostHog captures page views (if configured)
- [ ] Lighthouse scores are reasonable (see Performance section)

## Deploy to Other Hosting

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Node.js (standalone)

```bash
npm run build
npm run start
```

Requires a process manager (`pm2`, `systemd`) for production.

## Database Migrations (Supabase)

Migrations live in `supabase/migrations/`. Apply to production:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or apply SQL manually via Supabase Dashboard > SQL Editor.

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push/PR to `main`:

1. **lint-typecheck** — ESLint + TypeScript check
2. **test** — Vitest unit tests
3. **build** — Production build (depends on 1 + 2)
4. **analyze** — Bundle analysis (push only or with `analyze` label)

## Performance Budgets

Targets for production deployment:

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Total Blocking Time (TBT) | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 90 |
| Bundle size (initial JS) | < 200 KB gzip |

## Monitoring

### Sentry

- Tracks errors, performance traces, and crash reports
- Configured via `sentry.client.config.ts`, `sentry.edge.config.ts`, `sentry.server.config.ts`
- Automatically disabled when `NEXT_PUBLIC_SENTRY_DSN` is not set
- Traces sampled at 1.0 in production, 0.1 in dev

### PostHog

- Tracks page views, feature usage
- Configured in `src/shared/providers/AnalyticsProvider.tsx`
- Automatically disabled when `NEXT_PUBLIC_POSTHOG_KEY` is not set

## Security

- **Auth middleware**: `src/proxy.ts` protects all private routes, redirects unauthenticated users to `/auth`
- **CSP**: Content Security Policy configured in `next.config.mjs` restricts script/style sources, frames, form actions
- **RLS**: Row-Level Security policies on all Supabase tables prevent unauthorized data access
- **No secrets in client**: All API keys requiring secrecy (`GEMINI_API_KEY`, `UPSTASH_REDIS_REST_TOKEN`) are server-only
- **Public keys only**: `NEXT_PUBLIC_*` variables are safe for client exposure by design

## Backups

### Supabase

- Enable point-in-time recovery in Supabase project settings
- Schedule daily exports via Supabase Dashboard > Database > Backups

### Environment Variables

- Store a backup of `.env.local` values in a password manager (1Password, Bitwarden)
- Vercel encrypts environment variables at rest

## Domain & SSL

- Domain: `voyaq.app` (or your custom domain)
- SSL: Vercel provisions automatic SSL certificates via Let's Encrypt
- Redirect: `http://` → `https://`, `www.` → `apex` handled by Vercel
