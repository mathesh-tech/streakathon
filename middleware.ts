import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const path = req.nextUrl.pathname;
    
    // Check sliding session inactivity for 30 minutes
    const now = Date.now();
    const lastActivityStr = req.cookies.get("last-activity")?.value;
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    if (isAuth) {
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (now - lastActivity > INACTIVITY_TIMEOUT) {
          // Session expired due to inactivity
          const res = NextResponse.redirect(new URL("/auth/login?expired=true", req.url));
          res.cookies.delete("next-auth.session-token");
          res.cookies.delete("last-activity");
          return res;
        }
      }
      
      // Also check 8 hour normal session max-age if rememberMe is false
      // JWT token.iat is in seconds
      if (token.iat && !token.rememberMe) {
        const iatMs = (token.iat as number) * 1000;
        if (now - iatMs > 8 * 60 * 60 * 1000) {
          const res = NextResponse.redirect(new URL("/auth/login?expired=true", req.url));
          res.cookies.delete("next-auth.session-token");
          res.cookies.delete("last-activity");
          return res;
        }
      }
    }

    // Allow public API routes (e.g. login)
    if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/verify-email")) {
      return NextResponse.next();
    }

    let response = NextResponse.next();

    const isAuthPage = path.startsWith("/auth/login");

    if (isAuthPage) {
      if (isAuth) {
        if (token?.role === "ADMIN") response = NextResponse.redirect(new URL("/dashboard/admin", req.url));
        else if (token?.role === "AMBASSADOR") response = NextResponse.redirect(new URL("/dashboard/ambassador", req.url));
        else response = NextResponse.redirect(new URL("/dashboard/student", req.url));
      } else {
        return null;
      }
    } else if (!isAuth) {
      // 401 for APIs, Redirect for pages
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
      }
      let from = path;
      if (req.nextUrl.search) from += req.nextUrl.search;
      return NextResponse.redirect(new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url));
    } else {
      // Authenticated routing checks
      // Force password change flow
      if (token?.forcePasswordChange) {
        if (path !== "/auth/setup-password" && path !== "/api/auth/force-password-change") {
          if (path.startsWith("/api/")) {
            return NextResponse.json({ error: "Must change password first" }, { status: 403 });
          }
          response = NextResponse.redirect(new URL("/auth/setup-password", req.url));
        }
      } else {
        // Role-based protection
        if (path.startsWith("/dashboard/admin") || path.startsWith("/api/admin")) {
          if (token?.role !== "ADMIN") {
            if (path.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            response = NextResponse.redirect(new URL("/dashboard/student", req.url));
          }
        }

        if (path.startsWith("/dashboard/ambassador") || path.startsWith("/api/ambassador")) {
          if (token?.role !== "AMBASSADOR" && token?.role !== "ADMIN") {
            if (path.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            response = NextResponse.redirect(new URL("/dashboard/student", req.url));
          }
        }

        // Participants only can access student dashboard
        if (path.startsWith("/dashboard/student") && token?.role !== "PARTICIPANT") {
          if (token?.role === "ADMIN") response = NextResponse.redirect(new URL("/dashboard/admin", req.url));
          if (token?.role === "AMBASSADOR") response = NextResponse.redirect(new URL("/dashboard/ambassador", req.url));
        }
      }
    }

    // Update the last-activity cookie for sliding expiration
    if (isAuth && !isAuthPage) {
      response.cookies.set("last-activity", now.toString(), { path: "/", maxAge: 30 * 60 });
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Always return true to let middleware handle the logic and cookie deletion
        return true; 
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/api/admin/:path*", "/api/ambassador/:path*", "/api/student/:path*"],
};
