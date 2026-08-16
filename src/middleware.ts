import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/admin/login';
  const isAdminPath = path.startsWith('/admin') && !isPublicPath;
  
  // Login වෙද්දි දෙන JWT Token එක තියෙනවද බලනවා
  const token = request.cookies.get('token')?.value || '';

  if (isAdminPath && !token) {
    // Token එක නැත්නම් Login එකට යවනවා
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
  }

  if (isPublicPath && token) {
    // දැනටමත් ලොග් වෙලා නම්, කෙලින්ම Dashboard එකට යවනවා
    return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

// මේ Middleware එක run වෙන්න ඕන Paths ටික
export const config = {
  matcher: ['/admin/:path*']
};