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

  const { data } = await supabase
    .from("Users")
    .select()
    .eq("userid", session.user.id)
    .limit(1)
    .single();

  if(data && path == '/newpin') return NextResponse.redirect(new URL("/", req.url));
  else if (!data && path !== '/newpin') return NextResponse.redirect(new URL("/newpin", req.url));
  else return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
