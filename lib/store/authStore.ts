import { create } from 'zustand';
import type { User } from '@/types/user';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()(set => ({
  isAuthenticated: false,
  user: null,
  setUser: (user: User) => {
    console.log("STORE: Setting user", user);
    set(() => ({ user, isAuthenticated: true }));
  },
  clearIsAuthenticated: () => {
    console.log("STORE: Clearing auth");
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));
