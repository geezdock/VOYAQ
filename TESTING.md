# Testing

VOYAQ uses a three-layer test pyramid:

| Layer | Command | Speed | Backend |
| --- | --- | --- | --- |
| Unit / component | `npm test` | ~seconds | Mocked |
| E2E (mocked) | `npm run test:e2e` | ~minutes | Mocked auth + seeded cache |
| E2E (integration) | `npm run test:e2e:integration` | ~minutes | Real Supabase |

## Unit & component tests

- Runner: **Vitest** (jsdom), React Testing Library.
- Config: `vitest.config.ts` (`@` → `src`), setup: `tests/setup.ts`.
- Run once: `npm test` — watch: `npm run test:watch`.
- Test files live next to their code in `__tests__/` directories, e.g.
  `src/features/workspace/__tests__/TabSquad.test.tsx`.

Patterns to follow:

- Mock context/hook providers with `vi.mock` (`useSquad`, `useAuth`, etc.).
- Use `vi.hoisted` for mock functions referenced inside `vi.mock` factories.
- Stub lazy/dynamic children (e.g. `next/dynamic`) when testing a container.
- Query by role/heading/text; avoid brittle class-name assertions.
- Component tests must **not** require a running server or Supabase credentials.

## E2E tests (mocked, fast)

- Runner: **Playwright**, config `playwright.config.ts`.
- 6 projects (chromium, firefox, webkit, iPhone 13, Pixel 5, iPad Mini).
- Run all: `npm run test:e2e` — a single project: `npx playwright test --project=chromium`.
- Requires the dev server at `http://localhost:3000` (`npm run dev`).

The mocked suite uses two helpers from `e2e/helpers.ts`:

- `mockSupabaseSession(page)` — seeds `voyaq_dev_user` and `sb-session` so the
  app thinks the user is signed in.
- `seedMockSquad(page)` — seeds the `voyaq_squads_v1` localStorage cache and an
  empty `voyaq_pending_mutations` queue with a realistic `MOCK_SQUAD`.

Because `SquadRepository` reads the localStorage cache first, seeding the cache
keeps tests fast and offline. `stripNextDevTools(page)` and
`settleAnimations(page)` reduce dev-server/`framer-motion` flakiness.

Guidelines:

- Never change product behavior to satisfy a test; update the spec instead.
- Only test real app flows (e.g. workspace → destinations tab, never a
  nonexistent `/destinations` route).
- Prefer `getByRole` / `getByHeading` and exact text over substring matchers.
- After any a11y check, let animations settle before running `AxeBuilder`.

## E2E integration tests (real Supabase)

- Config: `playwright.integration.config.ts`, dir `e2e/integration/`.
- Run: `npm run test:e2e:integration`.
- Authenticates through the real `/auth` flow in `e2e/test-auth.setup.ts` and
  stores the session in `e2e/.auth/integration-user.json` (gitignored).

See [SUPABASE_TEST_SETUP.md](./SUPABASE_TEST_SETUP.md) for backend setup.

## CI

`.github/workflows/ci.yml`:

- `lint-typecheck`, `test` (unit), `build` run on every push/PR.
- `e2e-integration` runs only on a schedule and manual dispatch, not per PR.

## Useful commands

```bash
npm test                          # unit + component tests
npm run test:watch                # vitest watch
npm run test:e2e                  # all mocked e2e projects
npx playwright test --project=chromium   # one project
npx playwright test --ui          # interactive Playwright UI
npm run test:e2e:integration      # real-backend integration suite
npm run lint                      # ESLint
npm run typecheck                 # tsc --noEmit
```
