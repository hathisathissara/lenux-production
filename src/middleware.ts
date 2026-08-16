import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Paths ටික හඳුනාගැනීම
  const isPublicAdminPath = path === '/admin/login';
  const isAdminPath = path.startsWith('/admin') && !isPublicAdminPath;

  // Cookie එකෙන් token එක ගන්නවා
  const token = request.cookies.get('token')?.value || '';

  // 1. Token එක නැතුව Admin ඇතුළට යන්න හැදුවොත් Login එකට යවනවා
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
  }

  // 2. Token එක තියෙද්දි ආයෙත් Login Page එකට ගියොත් කෙලින්ම Dashboard එකට යවනවා
  if (isPublicAdminPath && token) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl));
  }

  return NextResponse.next();
}

// මේ Middleware එක Run වෙන්න ඕන paths ටික
export const config = {
  matcher: [
    '/admin/:path*'
  ]
};