import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@aruje:token";
const USER_KEY = "@aruje:user";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveUser(user: unknown) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser<T>() {
  const data = await AsyncStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as T;
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}