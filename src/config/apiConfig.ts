const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL =
  apiBaseUrl && apiBaseUrl.trim().length > 0
    ? apiBaseUrl
    : "http://localhost:8080";