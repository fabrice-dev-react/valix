import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/pricing",
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

  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    // Keep the raw path if it contains malformed encoding.
  }

  if (decodedPath.startsWith("/30_Days_to_Becoming_Your_Manager")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|html|css|js|map|txt|xml|webmanifest|mp4|webm|mov|m4v|woff|woff2)$).*)",
  ],
};
