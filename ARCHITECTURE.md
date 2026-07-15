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

Each feature under `src/features/<domain>/` follows:

```
features/<domain>/
├── components/        # Domain-specific components
├── constants/         # Domain-specific constants (optional)
├── __tests__/         # Co-located tests
└── index.ts           # Barrel exports
```

## Data Flow

1. **Pages** (`src/app/`) import feature components from `src/features/<domain>/`
2. **Feature components** use hooks from `src/shared/hooks/` and services from `src/services/`
3. **Services** make API calls and return typed data
4. **Shared providers** (AuthContext, SquadContext) wrap the app and provide state
5. **Types** are shared across all layers via `src/types/`
6. **Utils** provide pure helper functions used across features