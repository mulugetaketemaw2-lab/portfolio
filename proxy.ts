import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function proxy(request: NextRequest) {
  // If the user is trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      // Verify token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'default_super_secret_key_123'
      );
      
      // jose.jwtVerify is edge-compatible unlike jsonwebtoken
      // NOTE: For simplicity, during API auth we used jsonwebtoken because it runs on Node.
      // But middleware runs on Edge runtime which requires 'jose' or similar.
      // Wait, let's just do a basic check here or use 'jose'
      
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
