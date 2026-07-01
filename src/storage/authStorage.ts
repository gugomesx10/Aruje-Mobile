import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@aruje:token";
const USER_KEY = "@aruje:user";

export const UserRoles = {
  Admin: 1,
  Manager: 2,
  Operator: 3,
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export type AuthUser = {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveUser(user: AuthUser) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  const data = await AsyncStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as AuthUser;
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}