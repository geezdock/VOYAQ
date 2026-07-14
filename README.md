# VOYAQ

**Collaborative group travel planner for Indian students.** Budget, vote, and build itineraries as a squad — no spreadsheets, no group-chaos, no endless WhatsApp polls.

---

## Features

### Squad Workflow

| Stage | What happens |
|---|---|
| **Create / Join** | Start a squad with an invite code. Add friends, each gets a colour-coded avatar. |
| **Vote on Destinations** | Everyone submits and votes on destinations. Majority locks it in. |
| **Align Budgets** | Each member shares their budget anonymously. Median becomes the squad's per-person target. |
| **Coordinate Dates** | Propose date ranges, the squad votes. Lock it when a consensus forms. |
| **Custom Polls** | Create ad-hoc polls for accommodation type, travel mode, activities — anything. |
| **Trip Ready** | When dest + budget + dates are locked, the trip view becomes available. |

### Destination Hub (`/trip/[id]/hub`)

A full destination intelligence dashboard with 9 tabs:

- **Overview** — weather snapshot, budget health, event count, advisories, AI tip, quick facts
- **Weather** — current conditions + 5-day forecast
- **Food** — local cuisine recommendations with restaurant links, price ranges, tags
- **Places** — attractions grouped by category with costs, best times, durations
- **Events** — upcoming festivals, cultural events, concerts
- **Safety** — government travel advisories + emergency contacts
- **Transport** — how to get there + getting around, with cost estimates
- **Budget** — per-person cost breakdown vs squad's locked budget
- **AI Tips** — data-driven suggestions (weather swaps, budget optimisation, transport hacks)

Navigate tabs via click, arrow keys (`←` / `→`), or prev/next buttons.

### Trip Dashboard (`/trip/[id]`)

- Countdown to departure
- Status tracking (Booked / Pending / Cancelled)
- Quick stats: destination, dates, budget/person, member count
- Share trip link
- Cancel / rebook

### Landing Page

Scroll-driven story mode with interactive demo stages:

1. **The Chaos** — a messy group chat scenario
2. **Destination Voting** — live vote UI
3. **AI Itinerary** — generated day plan
4. **Celebration** — trip ready moment

Also includes: hero section, quick walkthrough, dual CTAs, featured-travel marquee ticker.

### Static Pages

| Route | Description |
|---|---|
| `/how-it-works` | Comparison table, real-world scenarios, FAQ, sharing/export info |
| `/safety` | Travel safety guidelines, emergency contacts, smart-travel tips |

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
| **Linting** | [ESLint 9](https://eslint.org/) (`eslint-config-next`) |
| **TypeScript** | 5.x — strict mode across codebase |
| **Package Manager** | npm |

---

## Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── (dashboard)/      # Route group: dashboard, profile, notifications
│   ├── auth/             # Auth flow
│   ├── trip/[id]/        # Trip overview + Destination Hub (/hub)
│   ├── workspace/[id]/   # Squad workspace (voting, budget, dates, polls)
│   └── ...               # Static pages (how-it-works, safety, settings, etc.)
│
├── components/           # React components by domain
│   ├── landing/          # Home page (splash, hero, story mode, demo)
│   ├── dashboard/        # Squad grid, cards, create modal, nav shell
│   ├── workspace/        # Workspace tabs + summary
│   ├── trip/             # Trip overview view
│   ├── destination/      # Destination Hub (10 modular sections)
│   ├── demo/             # Interactive demo steps
│   ├── how-it-works/     # Info pages
│   ├── safety/           # Safety guidelines
│   └── auth/             # Auth flow UI
│
├── lib/                  # Business logic, hooks, mock data
│   ├── hooks/            # Custom hooks (useDestination)
│   ├── SquadContext.tsx   # Global squad state provider
│   ├── destination-data.ts # Static destination intelligence
│   ├── mock.ts            # Mock squads for development
│   └── trip-utils.ts      # Date, budget, countdown utilities
│
├── types/                 # TypeScript interfaces
│   ├── squad.ts           # Squad, Member, Vote, Poll, etc.
│   ├── destination.ts     # Weather, Food, Attraction, Event, etc.
│   └── auth.ts            # Auth state types
│
└── tests/                 # Global test setup
    └── setup.ts           # jest-dom matchers
```

### Key Design Decisions

- **Mock-first development** — `SquadContext.tsx` provides synchronous mock data with no backend dependency. The `useDestination()` hook follows the same pattern: swap the data source when real APIs arrive.
- **Modular destination hub** — each section (Weather, Food, Safety, etc.) is an independent component in its own directory. The data layer (`destination-data.ts`) maps destination strings to objects — no `if/else` branching.
- **Route groups** — `(dashboard)` groups dashboard sub-pages under a shared layout without affecting the URL path.
- **Tests co-located** — `__tests__/` directories sit next to their source components, not in a central `tests/` folder.

---

## Routes

| Path | Description |
|---|---|
| `/` | Landing page (splash, hero, story mode, CTA) |
| `/auth` | Login — enter name, go to dashboard |
| `/dashboard` | Squad list — create or join a squad |
| `/create` | Create a new squad |
| `/join/[code]` | Join a squad by invite code |
| `/workspace/[id]` | Squad workspace (5 tabs) |
| `/trip/[id]` | Trip overview (countdown, stats, actions) |
| `/trip/[id]/hub` | Destination intelligence hub (9 tabs) |
| `/profile` | User profile |
| `/settings` | Account settings + sign out |
| `/notifications` | Notification preferences |
| `/how-it-works` | Product explainer |
| `/safety` | Travel safety guide |
| `/consent` | Parental consent (placeholder) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/geezdock/VOYAQ.git
cd VOYAQ

# Install
npm install

# Copy environment (optional — runs on mock data without it)
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works entirely with mock data — no database or accounts required.

### Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint (`--max-warnings 0`) |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm test` | Run all tests (Vitest) |
| `npm run test:watch` | Watch mode |

---

## Testing

153 tests across 15 test files. Tests are co-located with source files in `__tests__/` directories.

```bash
npm test          # Run once
npm run test:watch # Watch mode
```

**What's tested:**

- All workspace tabs (squad, destinations, dates, budget, polls) — 55 tests
- Trip view (stats, status, countdown, cancel/rebook) — 18 tests
- Dashboard (squad card, grid, create modal, avatar dropdown) — 19 tests
- Workspace summary (trip ready overlay) — 7 tests
- Utility functions (trip-utils, schemas, useAuthSteps) — 54 tests
- Schema validation (Zod) — 27 tests

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Trigger: Pull requests to `main`
- Runs: `ubuntu-latest`, Node 20
- Steps: `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build`

---

## Design System

Custom Tailwind theme with brut-inspired tokens:

- **Colors:** `surface`, `surface-card`, `surface-alt`, `ink`, `ink-muted`, `ink-light`, `accent`, `peach`, `peach-dark`, `clay`, `clay-light`, `error`, `success`
- **Borders:** `rounded-bruted` (custom 10px radius), `shadow-bruted` (solid 3px offset squares)
- **Typography:** `font-display` (bold condensed), `font-heading` (sans), `font-mono` (tabular data)
- **Components:** `brut-card`, `brut-btn`, `brut-input` — consistent shadow/border tokens

---

## Future Roadmap

- [ ] **AI Itinerary Generator** — day-by-day trip plans from locked destination + budget
- [ ] **Toolkit** — expense split, packing checklist, budget calculator, currency converter, offline downloads
- [ ] **Latest / Intel** — state-wise travel news, gov notices, weather alerts, festivals
- [ ] **Real API integration** — weather, places, events, transport pricing
- [ ] **Backend persistence** — re-add Supabase or alternative data layer
- [ ] **Beta testing** — onboarding flows, feedback collection

---

## License

MIT
