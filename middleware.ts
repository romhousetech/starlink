import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

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
      authorized: ({ token }) => !!token, // Require authentication for all matched routes
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
