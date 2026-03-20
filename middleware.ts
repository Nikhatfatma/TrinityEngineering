import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if the route is blocked by basic auth
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // Decode base64 
    const [user, pwd] = atob(authValue).split(':');

    // Retrieve credentials from environment variables (with fallback for local dev if missing)
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPwd = process.env.ADMIN_PASSWORD;

    // Only authenticate if the env vars are actually set to prevent default backdoor, unless missing (then fail secure)
    if (expectedUser && expectedPwd && user === expectedUser && pwd === expectedPwd) {
      return NextResponse.next();
    } else if (!expectedUser || !expectedPwd) {
        // If they aren't set, fail secure but allow bypass if we hardcode a fallback strictly for debugging? 
        // No, production best practice: fail if env vars missing.
        console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not set in environment variables.");
    }
  }

  // Require basic auth
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
    },
  });
}

// Only apply this middleware to admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
