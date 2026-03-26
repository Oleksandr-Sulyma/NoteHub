import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    if (accessToken) {
      try {
        await api.get('auth/session', {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            Cookie: `accessToken=${accessToken}; sessionId=${sessionId}`
          },
        });
        return NextResponse.json({ success: true, refreshed: false }, { status: 200 });
      } catch (error) {
        console.log("Access token invalid, trying to refresh...");
      }
    }

    if (refreshToken && sessionId) {
      const apiRes = await api.post('auth/refresh', {}, {
        headers: { 
          Cookie: `refreshToken=${refreshToken}; sessionId=${sessionId}` 
        },
      });

      const setCookie = apiRes.headers['set-cookie'] || apiRes.headers['Set-Cookie'];
      
      if (setCookie) {
        const response = NextResponse.json({ success: true, refreshed: true }, { status: 200 });
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const name = parsed.accessToken ? 'accessToken' : 
                       parsed.refreshToken ? 'refreshToken' : 
                       parsed.sessionId ? 'sessionId' : null;
          
          const value = name ? parsed[name] : null;

          if (name && value) {
            response.cookies.set({
              name,
              value,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || '/',
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
            cookieStore.set(name, value, {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path || '/',
                maxAge: Number(parsed['Max-Age']),
                httpOnly: true,
            });
          }
        }
        return response;
      }
    }

    return NextResponse.json({ success: false, refreshed: false }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Refresh Error:', error.response?.data || error.message);
      return NextResponse.json({ success: false, refreshed: false }, { status: 200 });
    }
    return NextResponse.json({ success: false, refreshed: false }, { status: 200 });
  }
}