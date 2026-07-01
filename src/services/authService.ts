import { api } from "./api";
import { saveToken, saveUser, UserRole } from "../storage/authStorage";

export type LoginResponse = {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
};

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });

  await saveToken(response.data.token);
  await saveUser({
    userId: response.data.userId,
    fullName: response.data.fullName,
    email: response.data.email,
    role: response.data.role,
  });

  return response.data;
}