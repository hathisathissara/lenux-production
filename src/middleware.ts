import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;


  const isPublicAdminPath = path === '/admin/login';
  const isAdminPath = path.startsWith('/admin') && !isPublicAdminPath;


  const token = request.cookies.get('token')?.value || '';

  if (isAdminPath && !token) {
    const loginUrl = new URL('/admin/login', request.nextUrl);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicAdminPath && token) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/admin';
    return NextResponse.redirect(new URL(callbackUrl, request.nextUrl));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/admin/:path*'
  ]
};