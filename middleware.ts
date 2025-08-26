import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ['/clients'];
  const authRoutes = ['/'];

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/clients', request.url));
  }
  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
