import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
            height: 72,
            paddingBottom: 10,
            paddingTop: 8,
            borderTopWidth: 1,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "800",
          },
        }}
      >
        <Tab.Screen
          name="Painel"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        >
          {() => <DashboardScreen onLogout={onLogout} />}
        </Tab.Screen>

        <Tab.Screen
          name="Leituras"
          component={ReadingsScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "sprout" : "sprout-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Alertas"
          component={AlertsScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "warning" : "warning-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Análises"
          component={AnalysesScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "sparkles" : "sparkles-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}