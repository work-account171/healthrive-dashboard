// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    // Token is valid → allow request
    return NextResponse.next();
  } catch {
    // Invalid token → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply to specific routes only
export const config = {
  matcher: ["/dashboard/:path*"], // Protect /dashboard and all subpages
};
