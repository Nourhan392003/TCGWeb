import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/:locale/admin(.*)",
]);

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

type SessionClaimsWithRole = {
  role?: string;
};

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (MAINTENANCE_MODE) {
    if (
      pathname === "/maintenance" ||
      pathname.startsWith("/_next") ||
      /\.(css|js|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|eot|json|txt|xml|csv|zip|webmanifest)$/.test(pathname)
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  console.log("MIDDLEWARE RUNNING:", req.nextUrl.pathname);

  if (isAdminRoute(req)) {
    const session = await auth();

    if (!session.userId) {
      return session.redirectToSignIn();
    }

    const role = (session.sessionClaims as SessionClaimsWithRole | undefined)?.role;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|/maintenance|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};