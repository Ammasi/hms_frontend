import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (token || pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!token || ['/home', '/hotelManagement'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home', '/hotelManagement'],
};
