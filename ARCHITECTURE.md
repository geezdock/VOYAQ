# Architecture

## Overview

Voyaq is a Next.js 16 application using the App Router with a **feature-first** architecture. Each domain of the application is encapsulated in its own feature module under `src/features/`.

## Principles

- **Feature-first**: Each domain (auth, dashboard, workspace, trip, destination, etc.) is a self-contained module under `src/features/<domain>/`.
- **Barrel exports**: Every directory has an `index.ts` that re-exports its public API.
- **Shared code**: Cross-cutting concerns live in `src/shared/` (hooks, providers, components).
- **Services**: All external API calls and Supabase client logic live in `src/services/`.
- **Types**: Shared TypeScript interfaces live in `src/types/`.
- **Utils**: Pure utility functions live in `src/utils/`.
- **Constants**: App-wide constants live in `src/constants/`.

## Feature Module Structure

### Key Features

| Feature | Path | Description |
|---|---|---|
| **Landing** | `src/features/landing/` | Scroll-driven story mode, demo stages, hero |
| **Destination Hub** | `src/features/destination/` | 9-tab intelligence dashboard (weather, food, places, etc.) |
| **Workspace** | `src/features/workspace/` | Squad workspace tabs (destinations, dates, budget, polls) |
| **Intel / Latest** | `src/features/intel/` | State-wise news, gov advisories, weather alerts |
| **Toolkit** | `src/features/toolkit/` | Packing list, budget calculator, currency converter |
| **Auth** | `src/features/auth/` | Sign-in flow, callback handling |

Each feature follows:

```
features/<domain>/
├── components/        # Domain-specific components
├── constants/         # Domain-specific constants (optional)
├── __tests__/         # Co-located tests
└── index.ts           # Barrel exports
```

## Data Flow

1. **Middleware** (`src/proxy.ts`) intercepts all requests — redirects unauthenticated users to `/auth`
2. **Pages** (`src/app/`) import feature components from `src/features/<domain>/`
3. **Feature components** use hooks from `src/shared/hooks/` and services from `src/services/`
4. **Services** make API calls and return typed data
5. **Shared providers** (AuthContext, SquadContext) wrap the app and provide state
6. **Types** are shared across all layers via `src/types/`
7. **Utils** provide pure helper functions used across features
8. **API routes** (`src/app/api/`) proxy external APIs (Open-Meteo, Wikipedia, Overpass, Gemini) with error handling
9. **Caching** (`src/lib/cache.ts`) provides dual-layer memoization (Upstash Redis + in-memory fallback)