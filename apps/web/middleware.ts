import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

// Routes only for guests (redirect to dashboard if logged in)
const GUEST_ONLY = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Refresh session and get the current logged-in user
  const { supabase, supabaseResponse, user } = await updateSession(req);

  const isGuestOnly = GUEST_ONLY.some((p) => pathname.startsWith(p));
  const isAdminRoute = pathname.startsWith("/admin");
  const isProviderRoute = pathname.startsWith("/dashboard/provider") || pathname.startsWith("/onboarding/provider");
  const isCustomerRoute = pathname === "/dashboard" || (pathname.startsWith("/dashboard/") && !isProviderRoute);

  // 1. Guest Routes Handling
  if (isGuestOnly && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard"; // Default redirect for logged-in users
    return NextResponse.redirect(url);
  }

  // 2. Protected Routes Handling
  if ((isAdminRoute || isCustomerRoute || isProviderRoute) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Admin Route Security
  if (isAdminRoute && user) {
    // Fetch user role from database
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const typedProfile = profile as { role?: string } | null;

    if (typedProfile?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/"; // Redirect non-admins to homepage
      return NextResponse.redirect(url);
    }
  }

  // 4. Provider Route Security
  if (isProviderRoute && user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const typedProfile = profile as { role?: string } | null;

    if (typedProfile?.role !== "provider" && typedProfile?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/partner"; // Redirect normal users to partner landing page
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};