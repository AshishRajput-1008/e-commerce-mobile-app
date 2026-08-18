import { create } from "zustand";
import { User, AuthCredentials, RegisterPayload } from "@/types";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isHydrated: false,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(credentials);
      set({ user, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e instanceof Error ? e.message : "Login failed" });
      throw e;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(payload);
      set({ user, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e instanceof Error ? e.message : "Registration failed" });
      throw e;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  hydrate: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  clearError: () => set({ error: null }),
}));
