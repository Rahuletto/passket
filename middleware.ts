import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req?.nextUrl?.pathname;

  const supabase = createMiddlewareClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && path !== "/auth/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  } else {
    const { data } = await supabase
      .from("Users")
      .select()
      .eq("userid", session?.user?.id)
      .limit(1)
      .single();

    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|).*)", "/public/:path*"],
};
