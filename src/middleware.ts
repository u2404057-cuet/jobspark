import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/jobs/add",
  "/jobs/manage",
  "/ai-coach"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const sessionCookie = request.cookies.get("better-auth.session_token");
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
