<p align="center">
  <a href="https://github.com/geezdock/VOYAQ/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/geezdock/VOYAQ/ci.yml?branch=main&label=CI&logo=github&style=flat-square" alt="CI"></a>
  <a href="https://github.com/geezdock/VOYAQ/blob/main/LICENSE"><img src="https://img.shields.io/github/license/geezdock/VOYAQ?style=flat-square&color=blue" alt="License"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase"></a>
  <br>
  <a href="https://travo-sable.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-voyaq.app-000?style=flat-square&logo=vercel&logoColor=white" alt="Live Demo"></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"></a>
  <a href="https://github.com/geezdock/VOYAQ/issues"><img src="https://img.shields.io/github/issues/geezdock/VOYAQ?style=flat-square" alt="Issues"></a>
  <img src="https://img.shields.io/badge/175_tests-passing-success?style=flat-square" alt="Tests">
</p>

<h1 align="center">VOYAQ</h1>
<p align="center"><strong>Collaborative group travel planner for Indian students.</strong><br>Budget, vote, and build itineraries as a squad — no spreadsheets, no group-chaos, no endless WhatsApp polls.</p>

---

## Features

### 🗺️ Squad Workflow

| Stage | What happens |
|---|---|
| **Create / Join** | Start a squad with an invite code. Add friends, each gets a colour-coded avatar. |
| **Vote on Destinations** | Everyone submits and votes on destinations. Majority locks it in. |
| **Align Budgets** | Each member shares their budget anonymously. Median becomes the squad's per-person target. |
| **Coordinate Dates** | Propose date ranges, the squad votes. Lock it when a consensus forms. |
| **Custom Polls** | Create ad-hoc polls for accommodation type, travel mode, activities — anything. |
| **Trip Ready** | When dest + budget + dates are locked, the trip view becomes available. |



### 🧰 Toolkit

Utility tools for trip planning:

- **Packing List** — 6 categories (clothes, toiletries, electronics, etc.), progress bar, add/remove custom items, localStorage persistence
- **Budget Calculator** — category-based estimated vs actual spending, summary cards
- **Currency Converter** — live rates via exchangerate-api.com, 15 currencies + INR, offline fallback

### 📡 Latest / Intel

State-wise travel intelligence for 26 Indian states:

- **State News** — Google News RSS per state
- **Gov Advisories** — curated travel advisories with severity levels
- **Weather Alerts** — Open-Meteo weather codes aggregated by state

### 📱 PWA / Offline

- Service worker with cache-first (static) and network-first (navigation) strategies
- Offline fallback page at `/offline`
- PWA manifest with app icons generated at build time

### 🏙️ Destination Hub

A full destination intelligence dashboard with 9 tabs: Overview, Weather, Food, Places, Events, Safety, Transport, Budget, AI Tips. Navigate via click, arrow keys (`←` / `→`), or prev/next buttons.

### ✈️ Trip Dashboard

Countdown to departure, status tracking (Booked / Pending / Cancelled), quick stats, share trip link, cancel/rebook.

### 🎬 Landing Page

Scroll-driven story mode with 4 interactive demo stages: The Chaos → Destination Voting → AI Itinerary → Celebration.

---

## Tech Stack

| Layer | Choice |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) with custom `brut` design tokens |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Testing** | [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [jsdom](https://github.com/jsdom/jsdom) |
| **E2E** | [Playwright](https://playwright.dev/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Realtime) |
| **AI** | [Google Gemini](https://ai.google.dev/) |
| **Caching** | [Upstash Redis](https://upstash.com/) + in-memory fallback |
| **Monitoring** | [Sentry](https://sentry.io/) (errors) + [PostHog](https://posthog.com/) (analytics) |
| **Linting** | [ESLint 9](https://eslint.org/) (`eslint-config-next`) |
| **TypeScript** | 5.x — strict mode across codebase |
| **Package Manager** | npm |

---

## Quick Start

```bash
git clone https://github.com/geezdock/VOYAQ.git
cd VOYAQ
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works entirely with mock data — no database or accounts required. Set `NEXT_PUBLIC_DEV_AUTH=true` in `.env.local` to bypass Supabase auth.

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `GEMINI_API_KEY` | No | Google Gemini AI (AI tips, itineraries, budget) |
| `NEXT_PUBLIC_DEV_AUTH` | No | Bypass Supabase auth for local dev |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry error tracking (leave blank to disable) |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis persistent caching |
| `UPSTASH_REDIS_REST_TOKEN` | No | Required if URL is set |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog product analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog API host |

All services are optional — the app runs fully without them.

---

## Architecture

```
src/
├── app/                  # Next.js App Router pages + API routes
├── features/            # Domain-specific feature modules
│   ├── destination/     # Destination Hub (9-tab dashboard)
│   ├── intel/           # Latest / Intel (news, advisories, weather)
│   ├── landing/         # Home page (story mode, demo, hero)
│   ├── toolkit/         # Packing, budget, currency tools
│   └── workspace/       # Squad workspace (voting, budget, dates)
├── shared/              # Cross-cutting (hooks, providers, components)
├── services/            # External API clients (Supabase)
├── proxy.ts             # Auth middleware (Next.js 16 auto-detected)
└── app/api/             # API route handlers
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

---

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm test` | Run all tests (Vitest) |
| `npm run analyze` | Build with bundle analyzer |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## Testing

**175 tests** across **17 test files**. Tests are co-located with source files in `__tests__/` directories.

| Area | Tests |
|---|---|
| Workspace tabs (squad, destinations, dates, budget, polls) | 55 |
| Trip view (stats, status, countdown, cancel/rebook) | 18 |
| Dashboard (squad card, grid, create modal, avatar dropdown) | 19 |
| Destination Hub (loading, empty, error, retry, data states) | 18 |
| Utility functions (trip-utils, schemas, useAuthSteps) | 54 |
| Schema validation (Zod) | 27 |
| `useFetch` hook | 4 |

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

- **Trigger:** Push or pull request to `main`
- **Concurrency:** Cancels in-progress runs on the same branch
- **Jobs (parallel):**
  1. **lint-typecheck** — ESLint + TypeScript check
  2. **test** — Vitest unit tests
  3. **build** — Production build (depends on lint/typecheck + test)
  4. **analyze** — Bundle analysis (push only or `analyze` label), artifact upload

---

## Design System

Custom Tailwind theme with brut-inspired tokens:

- **Colors:** `surface`, `surface-card`, `surface-alt`, `ink`, `ink-muted`, `ink-light`, `accent`, `peach`, `peach-dark`, `clay`, `clay-light`, `error`, `success`
- **Borders:** `rounded-bruted` (custom 10px radius), `shadow-bruted` (solid 3px offset squares)
- **Typography:** `font-display` (bold condensed), `font-heading` (sans), `font-mono` (tabular data)
- **Components:** `brut-card`, `brut-btn`, `brut-input`

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, code conventions, and PR process.

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel setup, environment configuration, security headers, post-deployment checklist, and monitoring setup.

---

## Roadmap

- [x] AI Itinerary Generator
- [x] Toolkit (packing, budget, currency)
- [x] Latest / Intel (news, advisories, weather)
- [x] PWA / Offline
- [x] CI Pipeline + Bundle Analysis
- [x] Sentry + Redis caching
- [x] Real API integration (weather, places, events, safety, transport, budget, AI)
- [ ] Internationalization
- [ ] Beta testing
- [ ] Expense sharing & settlement

---

## License

MIT
