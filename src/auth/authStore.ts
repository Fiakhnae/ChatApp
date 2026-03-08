import { create } from "zustand";
import type { User } from "../api/authApi";

type AuthStore = {
  user: User | null;
  isAuthResolved: boolean;
  setUser: (user: User | null) => void;
  setAuthResolved: (value: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthResolved: false,
  setUser: (user) => set({ user }),
  setAuthResolved: (value) => set({ isAuthResolved: value }),
  clear: () => set({ user: null, isAuthResolved: true }),
}));