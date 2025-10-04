import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that require authentication
const protectedRoutes = [
    "/snippets/new",
    "/snippets/edit",
    "/profile",
    "/dashboard",
];

// Routes that should redirect to home if user is already authenticated
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth-token")?.value;

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if the current route is an auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // If it's a protected route, check authentication
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // If it's an auth route and user is authenticated, redirect to home
    if (isAuthRoute && token) {
        const payload = verifyToken(token);
        if (payload) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
