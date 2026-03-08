import { http } from "@/api/http";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  gender: number;
  birthDate?: string;
  createdOnUtc: string;
}

export const userApi = {
  profile: async () => {
    const { data } = await http.get<UserProfile>("/users/me");
    return data;
  }
};