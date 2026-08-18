import { api, AUTH_TOKEN_KEY } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, AuthCredentials, RegisterPayload, User } from "@/types";

// USE_MOCK toggles between mock data and the real backend. Flip this to
// false (or delete the mock branches) once your API is live — the function
// signatures below already match what a REST backend would return.
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === "true";

const mockUser: User = {
  id: "u-001",
  fullName: "Ashish Sharma",
  email: "ashish@example.com",
  mobile: "+91 98765 43210",
  location: "Bhopal, Madhya Pradesh",
};

export const authService = {
  async login(credentials: AuthCredentials): Promise<User> {
    if (USE_MOCK) {
      await delay(700);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "mock-token");
      return mockUser;
    }
    const res = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/login",
      credentials
    );
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, res.data.data.token);
    return res.data.data.user;
  },

  async register(payload: RegisterPayload): Promise<User> {
    if (USE_MOCK) {
      await delay(900);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "mock-token");
      return { ...mockUser, fullName: payload.fullName, email: payload.email, mobile: payload.mobile };
    }
    const res = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/register",
      payload
    );
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, res.data.data.token);
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    if (USE_MOCK) return mockUser;
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
