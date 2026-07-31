import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const AUTH_FILE = path.join(__dirname, "..", ".auth", "integration-user.json");

function decodeBase64URL(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf8");
}

export function getAccessToken(): string {
  const raw = fs.readFileSync(AUTH_FILE, "utf8");
  const state = JSON.parse(raw) as { cookies?: { name: string; value: string }[] };
  const cookie = state.cookies?.find((c) => c.name.endsWith("-auth-token"));
  if (!cookie) throw new Error("No auth-token cookie found in integration storage state");

  let value = cookie.value;
  if (value.startsWith("base64-")) {
    value = decodeBase64URL(value.slice("base64-".length));
  }
  const parsed = JSON.parse(value) as unknown;
  const session = (Array.isArray(parsed) ? parsed[0] : parsed) as { access_token?: string };
  if (!session.access_token) throw new Error("Could not extract access_token from integration session");
  return session.access_token;
}

export function userClient(accessToken: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export async function deleteSquad(id: string, accessToken: string) {
  const { error } = await userClient(accessToken).from("squads").delete().eq("id", id);
  if (error) throw error;
}
