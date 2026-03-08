import { http } from "@/api/http";

export type User = {
  id: string;
  username: string;
};

export type SignInRequest = { 
  usernameOrEmail: string; 
  password: string, 
  rememberMe: boolean 
};

export type SignUpRequest = { 
  email: string; 
  username?: string, 
  password: string, 
  gender: number, 
  birthDate?: string, 
  rememberMe: boolean 
};

export const authApi = {
  me: async () => {
    const { data } = await http.get<User>("/auth/me");
    return data;
  },

  signIn: async (body: SignInRequest) => {
    await http.post<string>("/auth/sign-in", body);
  },

  signUp: async (body: SignUpRequest) => {
    await http.post<string>("/auth/sign-up", body);
  },

  signOut: async () => {
    await http.post("/auth/sign-out");
  },

  signOutAll: async () => {
    await http.post("/auth/sign-out-all");
  },
};