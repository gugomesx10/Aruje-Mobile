import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LoginScreen } from "./src/screens/LoginScreen";
import { MainTabs } from "./src/navigation/MainTabs";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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