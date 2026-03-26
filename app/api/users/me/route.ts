export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const formData = await request.formData();

    const username = formData.get('username') as string | null;
    const avatarFile = formData.get('avatar') as File | null;

    const requests: Promise<any>[] = [];

    if (username) {
      requests.push(
        api.patch('/users/me/username', { username }, {
          headers: { Cookie: cookieStore.toString() },
        })
      );
    }

    if (avatarFile) {
      const avatarForm = new FormData();
      avatarForm.append('avatar', avatarFile);

      requests.push(
        api.patch('/users/me/avatar', avatarForm, {
          headers: { Cookie: cookieStore.toString() },
        })
      );
    }

    const results = await Promise.all(requests);

    const updatedData: any = {};
    results.forEach(res => {
      if (res.data.username) updatedData.username = res.data.username;
      if (res.data.url) updatedData.photoUrl = res.data.url;
    });

    return NextResponse.json(updatedData, { status: 200 });

  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.put('/auth/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });

  } catch (error) {

    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { 
          error: error.message, 
          response: error.response?.data 
        },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}