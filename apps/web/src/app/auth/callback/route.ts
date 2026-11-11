import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const failure = () => NextResponse.redirect(new URL("/login?error=google", request.url));
  if (!code) return failure();

  try {
    const cookieStore = await cookies();
    const { data, error } = await createClient(cookieStore).auth.exchangeCodeForSession(code);
    if (error || !data.session) return failure();

    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const result = await fetch(`${api}/auth/oauth-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      }),
    });
    const sessionCookie = result.headers.get("set-cookie");
    if (!result.ok || !sessionCookie) return failure();
    const response = NextResponse.redirect(new URL("/", request.url));
    response.headers.append("Set-Cookie", sessionCookie);
    return response;
  } catch {
    return failure();
  }
}
