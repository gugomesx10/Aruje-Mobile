import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <DashboardScreen />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      <StatusBar style="dark" />
    </>
  );
}