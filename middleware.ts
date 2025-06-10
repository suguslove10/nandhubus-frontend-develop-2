

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  
  const cookies = req.cookies;

  
  console.log("Requested URL:", req.nextUrl.pathname);

  
  const userTypeCookie = cookies.get("userType"); 

  
  if (
    userTypeCookie &&
    userTypeCookie.value === "customer" &&
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    console.log("Redirecting customer to homepage");
    return NextResponse.redirect(new URL("/", req.url)); 
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: "/admin/:path*", 
};
