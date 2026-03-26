'use client';

import { useLayoutEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthInitializer({ user }: { user: any }) {
  const setUser = useAuthStore(state => state.setUser);
  const clear = useAuthStore(state => state.clearIsAuthenticated);

  useLayoutEffect(() => {
    if (user) {
      setUser(user);
    } else {
      const hasCookies = document.cookie.includes('refreshToken');
      if (!hasCookies) {
        clear();
      }
    }
  }, [user, setUser, clear]);

  return null;
}