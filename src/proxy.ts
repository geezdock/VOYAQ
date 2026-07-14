import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

const publicRoutes = new Set([
  "/",
  "/auth",
  "/how-it-works",
  "/safety",
  "/consent",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPaused = process.env.NEXT_PUBLIC_SUPABASE_PAUSED === "true";
  if (isPaused || publicRoutes.has(pathname) || pathname.startsWith("/auth/") || pathname.startsWith("/join/") || pathname.startsWith("/_next") || pathname.startsWith("/api/") || pathname.startsWith("/icon") || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("mode", "login");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
