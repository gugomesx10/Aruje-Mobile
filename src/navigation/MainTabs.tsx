import { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SensorsScreen } from "../screens/SensorsScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ReadingsScreen } from "../screens/ReadingsScreen";
import { AlertsScreen } from "../screens/AlertsScreen";
import { AnalysesScreen } from "../screens/AnalysesScreen";
import { RagAssistantScreen } from "../screens/RagAssistantScreen";
import { ReadingDetailsScreen } from "../screens/ReadingDetailsScreen";
import { AlertDetailsScreen } from "../screens/AlertDetailsScreen";
import { AnalysisDetailsScreen } from "../screens/AnalysisDetailsScreen";
import { SensorDetailsScreen } from "../screens/SensorDetailsScreen";
import { AuthUser, getUser, UserRoles } from "../storage/authStorage";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

type Props = {
  onLogout: () => void;
};

function TabsNavigator({ onLogout }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const storedUser = await getUser();

      if (isMounted) {
        setUser(storedUser);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const userRole = user?.role;

  const canSeeSensors =
    userRole === UserRoles.Admin || userRole === UserRoles.Manager;

  return (
    <View style={styles.tabsContainer}>
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

        {canSeeSensors ? (
          <Tab.Screen
            name="Sensores"
            component={SensorsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="access-point-network"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        ) : null}

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
                name={focused ? "analytics" : "analytics-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>

      <FloatingAssistantButton />
    </View>
  );
}

function FloatingAssistantButton() {
  const navigation = useNavigation<any>();

  function handleOpenAssistant() {
    navigation.navigate("RagAssistant");
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.floatingButton}
      onPress={handleOpenAssistant}
    >
      <View style={styles.floatingIconBox}>
        <Ionicons name="sparkles" size={22} color="#FFFFFF" />
      </View>

      <View>
        <Text style={styles.floatingTitle}>Arujé IA</Text>
        <Text style={styles.floatingSubtitle}>Atendimento virtual</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

export function MainTabs({ onLogout }: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs">
          {() => <TabsNavigator onLogout={onLogout} />}
        </Stack.Screen>

        <Stack.Screen name="RagAssistant" component={RagAssistantScreen} />
        <Stack.Screen name="ReadingDetails" component={ReadingDetailsScreen} />
        <Stack.Screen name="AlertDetails" component={AlertDetailsScreen} />
        <Stack.Screen
          name="AnalysisDetails"
          component={AnalysisDetailsScreen}
        />
        <Stack.Screen name="SensorDetails" component={SensorDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    right: 18,
    bottom: 92,
    zIndex: 50,
    elevation: 20,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  floatingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  floatingSubtitle: {
    marginTop: 1,
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: "700",
  },
});