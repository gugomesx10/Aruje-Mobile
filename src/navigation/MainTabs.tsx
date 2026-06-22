import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ReadingsScreen } from "../screens/ReadingsScreen";
import { AlertsScreen } from "../screens/AlertsScreen";
import { AnalysesScreen } from "../screens/AnalysesScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

type Props = {
  onLogout: () => void;
};

export function MainTabs({ onLogout }: Props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
          },
        }}
      >
        <Tab.Screen
          name="Painel"
          options={{ tabBarIcon: () => null }}
        >
          {() => <DashboardScreen onLogout={onLogout} />}
        </Tab.Screen>

        <Tab.Screen
          name="Leituras"
          component={ReadingsScreen}
          options={{ tabBarIcon: () => null }}
        />

        <Tab.Screen
          name="Alertas"
          component={AlertsScreen}
          options={{ tabBarIcon: () => null }}
        />

        <Tab.Screen
          name="Análises"
          component={AnalysesScreen}
          options={{ tabBarIcon: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}