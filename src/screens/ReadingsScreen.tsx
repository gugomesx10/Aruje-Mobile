import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getSensorReadings, SensorReading } from "../services/dashboardService";
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
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Sensores</Text>
          <Text style={styles.title}>Leituras IoT</Text>
          <Text style={styles.subtitle}>Últimos dados recebidos do Wokwi.</Text>
        </View>

        <Pressable style={styles.button} onPress={loadReadings}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : readings.length === 0 ? (
        <EmptyMessage text="Nenhuma leitura encontrada. Rode o Wokwi para gerar dados." />
      ) : (
        readings.map((reading) => (
          <View key={reading.id} style={styles.card}>
            <Text style={styles.cardTitle}>Leitura registrada</Text>
            <Text style={styles.date}>{formatDate(reading.createdAt ?? reading.readingDate)}</Text>

            <View style={styles.grid}>
              <Metric label="Temperatura" value={formatValue(reading.temperature, "°C")} />
              <Metric label="Umidade ar" value={formatValue(reading.airHumidity, "%")} />
              <Metric label="Umidade solo" value={formatValue(reading.soilMoisture, "%")} />
              <Metric label="Luminosidade" value={formatValue(reading.luminosity, "lux")} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function formatValue(value?: number | null, suffix?: string) {
  if (value === null || value === undefined) return "--";

  if (suffix === "lux") return `${Math.round(value)} ${suffix}`;

  return `${Number(value).toFixed(1)} ${suffix}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 24,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },
  date: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
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
  },
  metricLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
  },
  metricValue: {
    marginTop: 6,
    fontSize: 18,
    color: colors.text,
    fontWeight: "900",
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 20,
  },
});