import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");

    if (isAuthPage) {
      if (isAuth) {
        // Redirect to their respective dashboards if already logged in
        if (token?.role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        }
        if (token?.role === "AMBASSADOR") {
          return NextResponse.redirect(new URL("/dashboard/ambassador", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard/student", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Role-based protection
    if (req.nextUrl.pathname.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/dashboard/ambassador") && token?.role !== "AMBASSADOR") {
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/dashboard/student") && token?.role !== "STUDENT") {
      // Actually, if an admin wants to view the student dashboard, we might allow it.
      // But adhering to the PRD: "STUDENT Can only access their own data. Never allow privilege escalation."
      if (token?.role === "ADMIN" || token?.role === "AMBASSADOR") {
        return NextResponse.redirect(new URL(`/dashboard/${token.role.toLowerCase()}`, req.url));
      }
    }

    // Force password change flow
    if (token?.forcePasswordChange && !req.nextUrl.pathname.startsWith("/auth/setup-password")) {
      return NextResponse.redirect(new URL("/auth/setup-password", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/setup-password"],
};
