// middleware.ts
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Handle user management access (ADMIN only)
    if (pathname.startsWith('/admin/users') && token?.role !== 'ADMIN') {
      const url = new URL('/error', req.url);
      url.searchParams.set('error', 'unauthorized_access');
      return NextResponse.redirect(url);
    }

    // Handle other admin area access (ADMIN or STAFF)
    if (
      pathname.startsWith('/admin') &&
      !pathname.startsWith('/admin/users') &&
      token?.role !== 'ADMIN' &&
      token?.role !== 'STAFF'
    ) {
      const url = new URL('/error', req.url);
      url.searchParams.set('error', 'unauthorized_access');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
      error: '/error',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
