import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_AUTH === "true";

const PUBLIC_ROUTES = new Set([
  "/",
  "/auth",
  "/how-it-works",
  "/safety",
  "/consent",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/sw.js",
  "/offline",
]);

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/auth/callback")) return true;
  if (pathname.startsWith("/icon.svg")) return true;
  if (pathname.startsWith("/og-image.png")) return true;
  if (/^\/[^/]+\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)) return true;
  if (/\.[a-z]{2,6}$/.test(pathname)) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  if (DEV_MODE) {
    return NextResponse.next({ request });
  }

  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json|sw.js|offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
