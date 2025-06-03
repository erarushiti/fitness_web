// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  // Kontrollo nëse është faqe që kërkon admin
  if (url.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Kontrollo nëse është faqe që kërkon përdorues të identifikuar
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // rrugët që do mbrohen
};
