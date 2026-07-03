"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseEnv } from "./env";

export async function createProfile(params: {
  username: string;
  displayName: string;
  dob: string;
  parentContact?: { type: "phone" | "email"; value: string } | null;
}) {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnv();

  const supabase = createServerClient(url, key, {
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
    },
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username: params.username,
    display_name: params.displayName,
    phone: user.phone ?? null,
  });

  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "Username already taken" };
    }
    return { error: profileError.message };
  }

  if (params.dob) {
    const age = calculateAge(params.dob);
    if (age < 18 && params.parentContact) {
      await supabase.from("parental_consents").insert({
        profile_id: user.id,
        parent_contact_type: params.parentContact.type,
        parent_contact_value: params.parentContact.value,
      });
    }
  }

  revalidatePath("/dashboard");
  return { error: null };
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
