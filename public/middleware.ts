import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('hi');
  const res = NextResponse.next();
  const url = new URL(req.url);
  const supabase = createMiddlewareClient({ req, res });

  console.log(req.url, url.pathname);
  if (url.pathname === '/auth/callback') {
    const code = url.searchParams.get('code');
    console.log(code);
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect('/');
    }
  } else {
    await supabase.auth.getSession();
    return res;
  }
}
