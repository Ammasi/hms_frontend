import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/clients", "/dashboard"];
  const authRoutes = ["/"];

  // if logged in, block going back to "/"
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/clients", request.url));
  }

  // if not logged in, block protected
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
