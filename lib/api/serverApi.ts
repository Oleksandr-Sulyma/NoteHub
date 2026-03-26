import { nextServer } from './api';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse } from '@/types/note';

async function withRefresh<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (err.response?.status === 401) {
      const cookieStore = await cookies();
      const refreshRes = await nextServer.get('/auth/session', {
        headers: { Cookie: cookieStore.toString() },
      });

      if (refreshRes.data.success) {
        return await fn();
      }
    }
    throw err;
  }
}

export async function getServerMe(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!refreshToken || !sessionId) {
      return null;
    }
    const cookieHeader = `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId}`;

    const res = await nextServer.get('/users/me', {
      headers: { 
        Cookie: cookieHeader,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
    });

    return {
      email: res.data.email,
      username: res.data.username ?? null,
      photoUrl: res.data.avatar ?? null,
    };
  } catch (error: any) {
    return null;
  }
}

export const checkServerSession = async () => {
  try {
    const cookieStore = await cookies();

    const res = await nextServer.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
      withCredentials: true, 
    });

    return { 
      data: res.data, 
      headers: res.headers 
    };
  } catch (error) {
    throw error; 
  }
};

export const fetchNotesServer = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const fetchFn = () =>
    nextServer.get<FetchNotesResponse>('/notes', {
      headers: { Cookie: cookieStore.toString() },
      params: { ...params, perPage: 12 },
    });

  const res = await withRefresh(fetchFn);
  return res.data;
};

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const fetchFn = () =>
    nextServer.get<Note>(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });

  const res = await withRefresh(fetchFn);
  return res.data;
};
