import { NextResponse, type NextRequest } from "next/server";
import { JwtAuthTokenService } from "./auth-context/infrastructure/services/JwtAuthTokenService";
import { auth } from "./lib/auth";

const protectedRoutes = ["/"];
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/better-auth/login",
  "/better-auth/register",
];
export const runtime = "nodejs";

export const middleware = async (req: NextRequest) => {
  console.debug("Middleware running for:", req.nextUrl.pathname);
  const token = req.cookies.get("pixelwar_auth_token");
  const authTokenService = new JwtAuthTokenService(
    process.env.JWT_SECRET || "default",
  );

  const payload = token ? await authTokenService.verifyToken(token) : null;
  const betterAuthSession = await auth.api.getSession({ headers: req.headers });
  const isAuthenticated = !!payload || !!betterAuthSession;

  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    console.debug("Redirecting to login from middleware", {
      isProtectedRoute,
      isAuthenticated,
    });
    return NextResponse.redirect(new URL("/better-auth/login", req.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

// 5. Configure the matcher to run the middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public assets like favicons
     */
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)",
  ],
};
