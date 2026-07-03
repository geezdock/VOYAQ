import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const { url, key } = getSupabaseEnv();
    const supabase = createServerClient(url, key,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let redirectUrl = `${origin}${next}`;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

          if (!profile) {
            redirectUrl = `${origin}/auth?mode=setup`;
          }
        } catch {
          // Profile query failed — proceed to dashboard
        }
      }

      const response = NextResponse.redirect(redirectUrl);
      // Transfer cookies from request to response so auth session persists
      request.cookies.getAll().forEach((c) => {
        response.cookies.set(c.name, c.value);
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_callback_error`);
}
