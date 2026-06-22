import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { LoginScreen } from "./src/screens/LoginScreen";
import { MainTabs } from "./src/navigation/MainTabs";
import { getToken } from "./src/storage/authStorage";
import { colors } from "./src/theme/colors";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function loadStoredToken() {
      try {
        const token = await getToken();

        if (token) {
          setIsAuthenticated(true);
        }
      } finally {
        setLoadingAuth(false);
      }
    }

    loadStoredToken();
  }, []);

  if (loadingAuth) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <MainTabs onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      <StatusBar style="dark" />
    </>
  );
}