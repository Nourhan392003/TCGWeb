import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/:locale/admin(.*)",
]);

type SessionClaimsWithRole = {
  role?: string;
};

export default clerkMiddleware(async (auth, req) => {
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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};