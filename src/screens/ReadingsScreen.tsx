import { ReactNode, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ReadingsChartsSection } from "../components/ReadingsChartsSection";
import {
  getSensorReadings,
  SensorReading,
} from "../services/dashboardService";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

export function ReadingsScreen() {
  const navigation = useNavigation<any>();
  const loadingPulseAnim = useRef(new Animated.Value(1)).current;
  const refreshRotateAnim = useRef(new Animated.Value(0)).current;

  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReadings() {
    try {
      setLoading(true);

      const data = await getSensorReadings();

      const ordered = [...data].sort(
        (a, b) => getReadingTime(b) - getReadingTime(a)
      );

      setReadings(ordered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadReadings();
}, []);

useEffect(() => {
  if (!loading) {
    loadingPulseAnim.setValue(1);
    return;
  }

  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(loadingPulseAnim, {
        toValue: 1.08,
        duration: 750,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(loadingPulseAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );

  animation.start();

  return () => {
    animation.stop();
  };
}, [loading, loadingPulseAnim]);

useEffect(() => {
  if (!loading) {
    refreshRotateAnim.setValue(0);
    return;
  }

  const animation = Animated.loop(
    Animated.timing(refreshRotateAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );

  animation.start();

  return () => {
    animation.stop();
  };
}, [loading, refreshRotateAnim]);

  const refreshRotation = refreshRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Sensores</Text>
            <Text style={styles.title}>Leituras IoT</Text>
            <Text style={styles.subtitle}>
              Últimos dados enviados pelo Wokwi.
            </Text>
          </View>

          <Pressable
            style={styles.refreshButton}
            onPress={loadReadings}
            disabled={loading}
          >
          <Animated.View
            style={{
            transform: [{ rotate: refreshRotation }],
          }}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
        </Animated.View>
        </Pressable>
        </View>

        {loading ? (
      <View style={styles.loadingBox}>
          <Animated.View
          style={[
          styles.loadingIconBox,
          {
          transform: [{ scale: loadingPulseAnim }],
          },
          ]}
        >
        <MaterialCommunityIcons
        name="access-point-network"
        size={34}
        color={colors.primary}
          />
          </Animated.View>

          <ActivityIndicator color={colors.primary} size="large" />

          <Text style={styles.loadingTitle}>Carregando leituras</Text>
          <Text style={styles.loadingText}>
          Buscando os últimos dados enviados pelos sensores IoT.
          </Text>
        </View>
    ) : readings.length === 0 ? (
          <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
          <MaterialCommunityIcons
            name="sprout"
            size={38}
            color={colors.primary}
          />
          </View>

          <Text style={styles.emptyTitle}>Nenhuma leitura encontrada</Text>

          <Text style={styles.emptyText}>
          Rode o Wokwi para enviar dados de temperatura, umidade do ar,
          umidade do solo e luminosidade para o Arujé.
          </Text>

        <Pressable style={styles.emptyActionButton} onPress={loadReadings}>
        <Ionicons name="refresh" size={17} color="#FFFFFF" />
        <Text style={styles.emptyActionText}>Buscar novamente</Text>
        </Pressable>
      </View>
        ) : (
          <>
            <ReadingsChartsSection readings={readings} />

            {readings.map((reading, index) => (
              <Pressable
                key={`${reading.id}-${index}`}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() =>
                  navigation.navigate("ReadingDetails", {
                    reading,
                    title: `Leitura #${readings.length - index}`,
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons
                      name="access-point-network"
                      size={22}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardTitle}>
                      Leitura #{readings.length - index}
                    </Text>

                    <Text style={styles.date}>
                      {formatDate(reading.createdAt ?? reading.readingDate)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isCritical(reading) && styles.statusPillDanger,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isCritical(reading) && styles.statusPillTextDanger,
                      ]}
                    >
                      {isCritical(reading) ? "Risco" : "Normal"}
                    </Text>
                  </View>
                </View>

                <View style={styles.grid}>
                  <Metric
                    icon={
                      <MaterialCommunityIcons
                        name="thermometer"
                        size={20}
                        color={colors.primary}
                      />
                    }
                    label="Temperatura"
                    value={formatValue(reading.temperature, "°C")}
                  />

                  <Metric
                    icon={
                      <Ionicons
                        name="water-outline"
                        size={20}
                        color={colors.primary}
                      />
                    }
                    label="Umidade ar"
                    value={formatValue(reading.airHumidity, "%")}
                  />

                  <Metric
                    icon={
                      <MaterialCommunityIcons
                        name="sprout"
                        size={20}
                        color={colors.primary}
                      />
                    }
                    label="Umidade solo"
                    value={formatValue(reading.soilMoisture, "%")}
                  />

                  <Metric
                    icon={
                      <Ionicons
                        name="sunny-outline"
                        size={20}
                        color={colors.warning}
                      />
                    }
                    label="Luminosidade"
                    value={formatValue(reading.luminosity, "lux")}
                  />
                </View>
              </Pressable>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

type MetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function Metric({ icon, label, value }: MetricProps) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}>{icon}</View>

      <View style={styles.metricTextBox}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
}

function getReadingTime(reading: SensorReading) {
  const dateValue = reading.createdAt ?? reading.readingDate;

  if (!dateValue) {
    return 0;
  }

  const time = new Date(dateValue).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function formatValue(value?: number | null, suffix?: string) {
  if (value === null || value === undefined) {
    return "--";
  }

  if (suffix === "lux") {
    return `${Math.round(value)} ${suffix}`;
  }

  return `${Number(value).toFixed(1)} ${suffix}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString("pt-BR");
}

function isCritical(reading: SensorReading) {
  const temperature = reading.temperature ?? 0;
  const soilMoisture = reading.soilMoisture ?? 100;

  return temperature >= 35 || soilMoisture <= 20;
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
  },
  refreshButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  loadingText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  emptyCard: {
  backgroundColor: colors.surface,
  borderRadius: 28,
  padding: 26,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 10 },
  elevation: 5,
},
emptyIconBox: {
  width: 76,
  height: 76,
  borderRadius: 999,
  backgroundColor: colors.primaryLight,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
},
  emptyTitle: {
  fontSize: 18,
  fontWeight: "900",
  color: colors.primaryDark,
  textAlign: "center",
},
  emptyText: {
  marginTop: 8,
  color: colors.muted,
  fontSize: 13,
  lineHeight: 19,
  textAlign: "center",
},
emptyActionButton: {
  marginTop: 18,
  backgroundColor: colors.primary,
  borderRadius: 999,
  paddingHorizontal: 16,
  paddingVertical: 11,
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
emptyActionText: {
  color: "#FFFFFF",
  fontSize: 13,
  fontWeight: "900",
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
    width: 44,
    height: 44,
    borderRadius: 16,
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
  date: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillDanger: {
    backgroundColor: "#FCE4DE",
  },
  statusPillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  statusPillTextDanger: {
    color: colors.danger,
  },
  grid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metric: {
    width: "48%",
    backgroundColor: "#FAF8F1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  metricTextBox: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
  },
  metricValue: {
    marginTop: 4,
    fontSize: 16,
    color: colors.text,
    fontWeight: "900",
  },
  loadingIconBox: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryDark,
    textAlign: "center",
  },
});