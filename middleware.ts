import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ['/home', '/hotelManagement'];
  const authRoutes = ['/'];
 
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}