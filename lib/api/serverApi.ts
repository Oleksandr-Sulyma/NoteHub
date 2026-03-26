import { nextServer } from './api';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse } from '@/types/note';

async function withRefresh<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    // якщо помилка 401, пробуємо оновити сесію
    if (err.response?.status === 401) {
      const cookieStore = await cookies();
      const refreshRes = await nextServer.get('/auth/session', {
        headers: { Cookie: cookieStore.toString() },
      });

      if (refreshRes.data.success) {
        // повторюємо оригінальний запит
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


    const allCookies = cookieStore.getAll();
console.log("SERVER COOKIES NAMES:", allCookies.map(c => c.name));
    // Якщо немає основних ключів сесії - навіть не робимо запит
    if (!refreshToken || !sessionId) {
      console.log("getServerMe: Missing session cookies");
      return null;
    }

    // Формуємо Cookie заголовок вручну для бекенду
    const cookieHeader = `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId}`;

    const res = await nextServer.get('/users/me', {
      headers: { 
        Cookie: cookieHeader,
        // Додаємо Authorization тільки якщо accessToken є
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
    });

    return {
      email: res.data.email,
      username: res.data.username ?? null,
      photoUrl: res.data.avatar ?? null,
    };
  } catch (error: any) {
    // Якщо 401 або інша помилка - просто повертаємо null
    // Це НЕ дасть впасти всьому додатку
    console.error("getServerMe: Request failed", error.response?.status || error.message);
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
    console.error("Error in checkServerSession:", error);
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
