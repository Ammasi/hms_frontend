// 13-9-2025  redirectForRole add  suriya 

// middleware.ts  
// middleware.ts (only the parts that redirect to login need change)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_MAP: Record<string, string[]> = {
  "/clients": ["software", "owner"],
  "/dashboard": ["receptionist", "software"],
  "/checkin": ["receptionist", "software"],
   "/properties": ["software", "owner"],
  "/rooms": ["software", "owner"],
};
const AUTH_ROUTES = ["/"];

function redirectForRole(role?: string) {
  const r = (role ?? "").toString().toLowerCase();
  if (r === "receptionist") return "/dashboard";
  if (r === "software" || r === "owner" || r === "admin") return "/clients";
  return "/clients";
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/static/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("auth_role")?.value?.toString().toLowerCase();

  // If authenticated and visiting login page -> redirect by role
  if (token && AUTH_ROUTES.includes(pathname)) {
    const target = redirectForRole(role);
    return NextResponse.redirect(new URL(target, req.url));
  }
  

  // Find protected prefix
  const protectedPrefix = Object.keys(ROLE_MAP).find((p) => pathname.startsWith(p));

  // If route is protected but no token -> redirect to login and include redirect param
  if (!token && protectedPrefix) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("redirect", pathname + (req.nextUrl.search || ""));
    return NextResponse.redirect(loginUrl);
  }

  // If token present and route protected -> check role cookie
  if (token && protectedPrefix) {
    const allowed = ROLE_MAP[protectedPrefix].map((s) => s.toLowerCase());
    if (!role || !allowed.includes(role)) {
      return NextResponse.redirect(new URL("/clients", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
