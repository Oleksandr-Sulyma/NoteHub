'use client';

import { useLayoutEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthInitializer({ user }: { user: any }) {
  const setUser = useAuthStore(state => state.setUser);
  const clear = useAuthStore(state => state.clearIsAuthenticated);

  useLayoutEffect(() => {
    if (user) {
      // Якщо сервер знайшов юзера — синхронізуємо клієнт
      setUser(user);
    } else {
      // Якщо сервера каже null, ми ПЕРЕВІРЯЄМО, чи є в куках хоча б щось.
      // Якщо кук взагалі немає (був Logout), тоді очищуємо стор.
      const hasCookies = document.cookie.includes('refreshToken');
      if (!hasCookies) {
        clear();
      }
    }
  }, [user, setUser, clear]);

  return null;
}