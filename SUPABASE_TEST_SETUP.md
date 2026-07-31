# Supabase Test Setup

The mocked E2E suite runs fully offline — no Supabase project needed. The
**integration** suite (`npm run test:e2e:integration`) talks to a real Supabase
backend, so a project with the schema applied is required.

## 1. Choose or create a project

You may use your existing dev project, but a dedicated test project is safer so
integration runs never pollute real data. The setup does **not** assume a
specific project name; any project with the schema below works.

## 2. Apply the schema

Apply the migrations (they contain the `squads`, `squad_members`,
`destinations`, `destination_votes`, `budget_preferences`, `date_proposals`,
`polls`, and expense tables, the RLS policies, and the `create_squad` RPC):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or copy `supabase/migrations/*.sql` into the Supabase SQL editor and run them in
order.

## 3. Enable the auth flows the suite exercises

In the Supabase dashboard → **Authentication → Providers / Settings**:

- **Sign in / Up** → enable **Email** provider (used by the magic-link flow).
- **Auth → Sign In / Up → Anonymous sign-ins** → **enable** (the app signs in
  anonymously during the integration auth setup).

## 4. Provide credentials

Integration tests read the same env vars as the app:

- `NEXT_PUBLIC_SUPABASE_URL` — e.g. `https://abcd1234.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These must be present **both** in the dev server environment and the Playwright
process when you run the integration suite.

Local example (`$env:` on Windows PowerShell, `export` on Linux/macOS):

```bash
$env:NEXT_PUBLIC_SUPABASE_URL="https://abcd1234.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
npm run test:e2e:integration
```

> Do not set `NEXT_PUBLIC_DEV_AUTH=true` for integration runs — that enables the
> localStorage-only auth bypass and would not exercise the real backend.

## 5. What the integration suite does

1. `e2e/test-auth.setup.ts` opens `/auth`, submits a name, and waits for the
   real anonymous sign-in to land on `/dashboard`, saving the session to
   `e2e/.auth/integration-user.json` (gitignored).
2. Specs in `e2e/integration/` drive the real backend — e.g. create a squad
   through the wizard and verify it persists in Supabase.
3. Specs clean up the rows they create (via `e2e/integration/helpers.ts`).

## 6. CI

The `e2e-integration` job in `.github/workflows/ci.yml` runs on a schedule and
manual dispatch. Configure repository secrets:

- `INTEGRATION_SUPABASE_URL`
- `INTEGRATION_SUPABASE_ANON_KEY`

## Troubleshooting

- **Setup fails on the auth page** → anonymous sign-ins are disabled; see step 3.
- **Squad creation errors** → schema not applied or `create_squad` RPC missing;
  re-run step 2.
- **401s from REST** → the anon key doesn't match the project URL.
