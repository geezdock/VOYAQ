const REQUIRED_VARS = [
  ["NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL"],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase anon/public key"],
] as const;

const missing: string[] = [];

for (const [key, label] of REQUIRED_VARS) {
  if (!process.env[key]) {
    missing.push(`  ${key} — ${label}`);
  }
}

if (missing.length > 0) {
  throw new Error(
    [
      "Missing required environment variables:",
      ...missing,
      "Set them in .env.local or your deployment environment.",
    ].join("\n"),
  );
}
