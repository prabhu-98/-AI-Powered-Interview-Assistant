import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUser, logoutUser } from './actions/user-actions';

const publicRoutes = ["/login", "/sign-up", "/"];
 
export async function middleware(request: NextRequest) {
  const user = await getUser();
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  if (request.nextUrl.pathname === "/logout") {
    await logoutUser();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if(!isPublicRoute && !user){
    return NextResponse.redirect(new URL("/login", request.url));
  } 

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
