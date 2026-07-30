# Contributing

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/geezdock/VOYAQ.git
cd VOYAQ
npm install
cp .env.example .env.local
npm run dev
```

## Development

### Commands

| Command | Action |
|---|---|
| `npm run dev` | Start dev server on `localhost:3000` |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type-check |
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run analyze` | Build with bundle analyzer |

### Dev Mode

Set `NEXT_PUBLIC_DEV_AUTH=true` in `.env.local` to bypass Supabase auth. The app runs fully with mock data.

## Code Conventions

- **Feature-first**: each domain under `src/features/<domain>/`
- **Barrel exports**: `index.ts` re-exports public API from each directory
- **Co-located tests**: `__tests__/` next to source files
- **No default exports**: prefer named exports for components
- **TypeScript strict mode**: avoid `any`, prefer explicit types
- **Tailwind**: use custom design tokens (`surface`, `accent`, `brut-card`, etc.)

## Pull Request Process

1. Create a branch from `main`: `git checkout -b feat/your-feature`
2. Make changes, keeping commits small and descriptive
3. Run all checks:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
4. Push and open a PR against `main`
5. CI runs automatically — all checks must pass
6. Request review from a maintainer

## Project Structure

```
src/
├── app/                  Next.js App Router pages + API routes
├── features/            Feature modules (domain-specific)
│   ├── destination/     Destination Hub components
│   ├── intel/           Latest / Intel (news, advisories, weather)
│   ├── landing/         Home page
│   ├── toolkit/         Packing list, budget calc, currency converter
│   └── workspace/       Squad workspace tabs
├── shared/              Cross-cutting (hooks, providers, components)
├── services/            External API clients (Supabase)
├── constants/           App-wide constants
├── types/               Shared TypeScript interfaces
├── utils/               Pure utility functions
├── proxy.ts             Auth middleware (Next.js 16)
└── app/api/             API route handlers
```
