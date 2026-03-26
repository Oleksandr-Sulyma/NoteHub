import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const sessionId = cookieStore.get('sessionId')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  if (!accessToken && refreshToken && sessionId) {
    try {
      const data = await checkServerSession();
      
      const setCookieHeaders = data.headers['set-cookie'] || data.headers['Set-Cookie'];

      if (setCookieHeaders) {
        const response = isPublicRoute 
          ? NextResponse.redirect(new URL('/', request.url)) 
          : NextResponse.next();

        const cookieArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          let name = null;
          if (parsed.accessToken) name = 'accessToken';
          else if (parsed.refreshToken) name = 'refreshToken';
          else if (parsed.sessionId) name = 'sessionId';
          
          const value = name ? parsed[name] : null;

          if (name && value) {
            response.cookies.set({
              name,
              value,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: '/', 
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
          }
        }
        return response;
      }
    } catch (error) {
      if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
    }
  }

  if (!accessToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};