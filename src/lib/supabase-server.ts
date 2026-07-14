import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

const isPaused = () => process.env.NEXT_PUBLIC_SUPABASE_PAUSED === "true";

export async function createServerSupabase() {
  if (isPaused()) throw new Error("Supabase is paused (NEXT_PUBLIC_SUPABASE_PAUSED=true)");
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}
