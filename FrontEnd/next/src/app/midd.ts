import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const { pathname } = request.nextUrl;

  // 🔓 rotas públicas
  const publicRoutes = ["/login"];

  const isPublic = publicRoutes.includes(pathname);

  
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

 
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/main/:path*", "/login"],
};