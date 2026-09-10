import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/admin",
  "/privacy",
  "/terms",
  "/cookies",
  "/contact",
];

const matches = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname === path || pathname.startsWith(path + "/"));

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isPublic = matches(pathname, PUBLIC_PATHS);
  const isApiAuth = pathname.startsWith("/api/auth");
  const isApiRoute = pathname.startsWith("/api/");

  if (!token) {
    if (!isPublic && !isApiAuth && !isApiRoute) {
      const loginUrl = new URL("/?login=1", request.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
