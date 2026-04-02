import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/track',
  '/api/auth',
  '/api/webhook',
];

// Public API route patterns (regex)
const PUBLIC_API_PATTERNS = [
  /^\/api\/widget\/[^/]+\/reviews$/,
  /^\/api\/widget\/[^/]+\/highlights$/,
  /^\/api\/widget\/[^/]+\/email$/,
];

function isPublicApiRoute(pathname: string): boolean {
  // Exact prefix matches
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return true;
  }
  // Pattern matches
  if (PUBLIC_API_PATTERNS.some(pattern => pattern.test(pathname))) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard/* routes
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // Protect /api/* routes (except public ones)
  if (pathname.startsWith('/api/') && !isPublicApiRoute(pathname)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
