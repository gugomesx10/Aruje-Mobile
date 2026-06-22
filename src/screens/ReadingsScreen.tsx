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

import {
  getSensorReadings,
  SensorReading,
} from "../services/dashboardService";
import { colors } from "../theme/colors";

export function ReadingsScreen() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReadings() {
    try {
      setLoading(true);

      const data = await getSensorReadings();

      const ordered = [...data].sort(
        (a, b) =>
          new Date(b.createdAt ?? b.readingDate).getTime() -
          new Date(a.createdAt ?? a.readingDate).getTime()
      );

      setReadings(ordered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReadings();
  }, []);

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

          <Pressable style={styles.refreshButton} onPress={loadReadings}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando leituras...</Text>
          </View>
        ) : readings.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="sprout-outline"
              size={34}
              color={colors.primary}
            />
            <Text style={styles.emptyTitle}>Nenhuma leitura encontrada</Text>
            <Text style={styles.emptyText}>
              Rode o Wokwi para gerar dados de temperatura, umidade e
              luminosidade.
            </Text>
          </View>
        ) : (
          readings.map((reading, index) => (
            <View key={reading.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="access-point-network"
                    size={22}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.cardTitleBox}>
                  <Text style={styles.cardTitle}>Leitura #{readings.length - index}</Text>
                  <Text style={styles.date}>
                    {formatDate(reading.createdAt ?? reading.readingDate)}
                  </Text>
                </View>

                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
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
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

type MetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function Metric({ icon, label, value }: MetricProps) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}>{icon}</View>

      <View>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
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

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR");
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
  statusPillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
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
});