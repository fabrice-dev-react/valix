import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/login",
];

const PAYMENT_PATHS = [
  "/payment",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isPublic = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"));
  const isApiAuth = pathname.startsWith("/api/auth");
  const isApiRoute = pathname.startsWith("/api/");
  const isPaymentPath = PAYMENT_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"));

  // Not signed in → send to login (except public, payment and API routes).
  if (!isPublic && !isApiAuth && !isApiRoute && !isPaymentPath && !token) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Signed in but hasn't paid → block everything except the payment flow.
  if (token && !isPublic && !isApiAuth && !isApiRoute && !isPaymentPath && !token.hasPaid) {
    return NextResponse.redirect(new URL("/payment", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
