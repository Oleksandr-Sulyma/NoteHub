'use client';

import { ReactNode, useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  // Ми прибрали useEffect, бо стан ініціалізується в AuthInitializer
  return <>{children}</>;
}
