import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/admin",
  "/book",
  "/privacy",
  "/terms",
  "/cookies",
  "/contact",
];

// Funnel-stage pages. Each is only reachable during its own stage.
const ONBOARDING_PATHS = ["/onboarding"];
const PHONE_PATHS = ["/phone"];

// The fully-onboarded, paid, phone-connected app area.
const MEMBER_PATHS = [
  "/dashboard",
  "/leads",
  "/settings",
  "/billing",
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
  const isOnboarding = matches(pathname, ONBOARDING_PATHS);
  const isPhone = matches(pathname, PHONE_PATHS);
  const isMember = matches(pathname, MEMBER_PATHS);

  // Anonymous visitors: block anything app-related and send them to the
  // landing page so they can sign in.
  if (!token) {
    if (!isPublic && !isApiAuth && !isApiRoute) {
      const loginUrl = new URL("/?login=1", request.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Signed-in users must progress through the setup funnel in order:
  // payment → onboarding → phone connection → the app.
  const onboardingDone = !!token.onboardingCompleted;
  const paid = !!token.hasPaid;
  const phoneStarted = !!token.phoneStatus && token.phoneStatus !== "not_connected";

  // Stage 1 — payment comes first.
  if (!paid) {
    if (isOnboarding || isPhone || isMember) {
      return NextResponse.redirect(new URL("/payment", request.nextUrl));
    }
    return NextResponse.next();
  }

  // Stage 2 — onboarding must be completed next.
  if (paid && !onboardingDone) {
    if (isPhone || isMember) {
      return NextResponse.redirect(new URL("/onboarding", request.nextUrl));
    }
    return NextResponse.next();
  }

  // Stage 3 — the business phone must be submitted before the app opens.
  if (paid && onboardingDone && !phoneStarted) {
    if (isMember) {
      return NextResponse.redirect(new URL("/phone", request.nextUrl));
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
