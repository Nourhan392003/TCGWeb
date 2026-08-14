import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/:locale/admin(.*)",
]);

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

type SessionClaimsWithRole = {
  role?: string;
  metadata?: {
    role?: string;
  };
  publicMetadata?: {
    role?: string;
  };
  [key: string]: any;
};

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  const cleanPathname = pathname.replace(/\/+$/, "");

  const isMaintenancePath =
    cleanPathname === "/maintenance" ||
    /^\/[^/]+\/maintenance$/.test(cleanPathname);

  if (isMaintenancePath) {
    return NextResponse.next();
  }

  if (MAINTENANCE_MODE) {
    if (
      pathname.startsWith("/_next") ||
      /\.(css|js|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2?|ttf|eot|json|txt|xml|csv|zip|webmanifest)$/.test(pathname)
    ) {
      return NextResponse.next();
    }
    const localeMatch = cleanPathname.match(/^\/([^/]+)(?:\/|$)/);
    const locale = localeMatch?.[1];

    return NextResponse.redirect(
      new URL(locale ? `/${locale}/maintenance` : "/maintenance", req.url)
    );
  }

  console.log("MIDDLEWARE RUNNING:", req.nextUrl.pathname);

  if (isAdminRoute(req)) {
    const session = await auth();

    if (!session.userId) {
      console.log("ADMIN AUTH CHECK: no userId, redirecting to sign-in");
      return session.redirectToSignIn();
    }

    const claims = session.sessionClaims as SessionClaimsWithRole | undefined;

    const role =
      claims?.role ??
      claims?.metadata?.role ??
      claims?.publicMetadata?.role;

    console.log("ADMIN AUTH CHECK:", {
      pathname,
      userId: session.userId,
      resolvedRole: role,
      roleSource: role
        ? claims?.role
          ? "claims.role"
          : claims?.metadata?.role
            ? "claims.metadata.role"
            : "claims.publicMetadata.role"
        : "none",
      allowed: role === "admin",
      claimsKeys: claims ? Object.keys(claims) : [],
      publicMetadata: claims?.publicMetadata,
    });

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|/maintenance|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
