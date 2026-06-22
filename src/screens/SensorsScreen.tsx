import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getSensors, Sensor } from "../services/dashboardService";
import { colors } from "../theme/colors";

export function SensorsScreen() {
  const navigation = useNavigation<any>();

  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSensors() {
    try {
      setLoading(true);

      const data = await getSensors();

      setSensors(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSensors();
  }, []);

  const activeSensors = sensors.filter((sensor) => sensor.isActive !== false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Dispositivos</Text>
            <Text style={styles.title}>Sensores</Text>
            <Text style={styles.subtitle}>
              Equipamentos IoT cadastrados para monitoramento agrícola.
            </Text>
          </View>

          <Pressable style={styles.refreshButton} onPress={loadSensors}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.overviewCard}>
          <View>
            <Text style={styles.overviewLabel}>Sensores cadastrados</Text>
            <Text style={styles.overviewValue}>{sensors.length}</Text>
          </View>

          <View style={styles.overviewDivider} />

          <View>
            <Text style={styles.overviewLabel}>Ativos</Text>
            <Text style={styles.overviewValue}>{activeSensors.length}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando sensores...</Text>
          </View>
        ) : sensors.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="access-point-network-off"
              size={38}
              color={colors.primary}
            />
            <Text style={styles.emptyTitle}>Nenhum sensor encontrado</Text>
            <Text style={styles.emptyText}>
              Quando os sensores forem cadastrados na API, eles aparecerão aqui.
            </Text>
          </View>
        ) : (
          sensors.map((sensor) => {
            const sensorType = getSensorType(sensor);
            const sensorInfo = getSensorInfo(sensorType);

            return (
              <Pressable
                key={sensor.id}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() =>
                  navigation.navigate("SensorDetails", {
                    sensor,
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons
                      name={sensorInfo.icon}
                      size={24}
                      color={sensorInfo.color}
                    />
                  </View>

                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardTitle}>
                      {sensor.name ?? "Sensor sem nome"}
                    </Text>

                    <Text style={styles.sensorType}>{sensorInfo.label}</Text>
                  </View>

                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>
                      {sensor.isActive === false ? "Inativo" : "Online"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Identificador</Text>
                  <Text style={styles.infoValue}>{sensor.id}</Text>
                </View>

                {sensor.description ? (
                  <Text style={styles.description}>{sensor.description}</Text>
                ) : (
                  <Text style={styles.description}>
                    Sensor preparado para receber leituras da simulação IoT.
                  </Text>
                )}

                {sensor.createdAt ? (
                  <Text style={styles.date}>
                    Criado em {new Date(sensor.createdAt).toLocaleString("pt-BR")}
                  </Text>
                ) : null}
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

function getSensorType(sensor: Sensor) {
  return sensor.sensorType ?? sensor.type ?? "Unknown";
}

function getSensorInfo(value: string | number): {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
} {
  if (value === 1 || value === "1" || value === "Temperature") {
    return {
      label: "Temperatura",
      icon: "thermometer",
      color: colors.primary,
    };
  }

  if (value === 2 || value === "2" || value === "Humidity") {
    return {
      label: "Umidade do ar",
      icon: "water-percent",
      color: colors.primary,
    };
  }

  if (value === 3 || value === "3" || value === "SoilMoisture") {
    return {
      label: "Umidade do solo",
      icon: "sprout",
      color: colors.primary,
    };
  }

  if (value === 4 || value === "4" || value === "Luminosity") {
    return {
      label: "Luminosidade",
      icon: "white-balance-sunny",
      color: colors.warning,
    };
  }

  if (value === 5 || value === "5" || value === "Motion") {
    return {
      label: "Movimento",
      icon: "motion-sensor",
      color: colors.primary,
    };
  }

  return {
    label: String(value),
    icon: "access-point-network",
    color: colors.primary,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  page: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  header: {
    marginTop: 18,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  title: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  refreshButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  overviewCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overviewLabel: {
    color: "#DCE8D8",
    fontSize: 13,
    fontWeight: "700",
  },
  overviewValue: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },
  overviewDivider: {
    width: 1,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  loadingBox: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: 8,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleBox: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },
  sensorType: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  infoBox: {
    marginTop: 16,
    backgroundColor: "#FAF8F1",
    borderRadius: 18,
    padding: 14,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },
  infoValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  date: {
    marginTop: 12,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});