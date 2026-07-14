import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

const isPaused = () => process.env.NEXT_PUBLIC_SUPABASE_PAUSED === "true";

export function createClient() {
  if (isPaused()) throw new Error("Supabase is paused (NEXT_PUBLIC_SUPABASE_PAUSED=true)");
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
}
