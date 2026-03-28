import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Basic Auth Middleware for Next.js
 * 
 * Securely handles /admin route authentication using environment variables.
 * Implements fixes for:
 * 1. Env variable loading and logging
 * 2. Trimmed credentials
 * 3. Robust header parsing (indexOf vs split)
 * 4. Cache-Control: no-store to prevent loop
 */

const getDynamicEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env) {
    const val = process.env[key] || '';
    // Log the length and first/last character for debugging (safely)
    if (val) {
      const firstChar = val.charAt(0);
      const lastChar = val.charAt(val.length - 1);
      console.log(`[AUTH ENV] Loaded ${key} (length: ${val.length}, first: "${firstChar}", last: "${lastChar}")`);
    } else {
      console.warn(`[AUTH ENV] Missing ${key}`);
    }
    return val;
  }
  return '';
};

export function middleware(req: NextRequest) {
  // Check if the route is blocked by basic auth
  const authHeader = req.headers.get('authorization') || req.headers.get('x-forwarded-authorization');

  if (authHeader) {
    try {
      const authParts = authHeader.split(' ');
      if (authParts.length === 2 && authParts[0].toLowerCase() === 'basic') {
        const authValue = authParts[1];
        
        // Decode base64 safely
        const decoded = atob(authValue);
        const index = decoded.indexOf(':');
        
        if (index !== -1) {
          const user = decoded.substring(0, index).trim();
          const pwd = decoded.substring(index + 1).trim();

          const expectedUser = getDynamicEnv('ADMIN_USERNAME').trim();
          const expectedPwd = getDynamicEnv('ADMIN_PASSWORD').trim();

          // Compare credentials
          if (expectedUser && expectedPwd && user === expectedUser && pwd === expectedPwd) {
            return NextResponse.next();
          } else {
            console.error(
              `[AUTH FAILED] User: "${user}" | Expected User Set: ${!!expectedUser} | Pwd Match: ${pwd === expectedPwd}`
            );
          }
        } else {
          console.warn("[AUTH ERROR] Invalid authorization header format (missing colon)");
        }
      }
    } catch (e) {
      console.error("[AUTH ERROR] Decode failed:", e);
    }
  } else {
    console.log("[AUTH TRIGGER] No Authorization header. URL:", req.url);
  }

  // Require basic auth with no-store headers to prevent caching 401 response
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  });
}

// Only apply this middleware to admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
