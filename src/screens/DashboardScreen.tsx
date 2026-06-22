import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AiAnalysis,
  Alert,
  getAiAnalyses,
  getAlerts,
  getApiHealth,
  getSensorReadings,
  SensorReading,
} from "../services/dashboardService";
import { clearAuth } from "../storage/authStorage";
import { colors } from "../theme/colors";

type Props = {
  onLogout?: () => void;
};

export function DashboardScreen({ onLogout }: Props) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analyses, setAnalyses] = useState<AiAnalysis[]>([]);
  const [apiStatus, setApiStatus] = useState("Carregando...");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [healthData, readingsData, alertsData, analysesData] =
        await Promise.all([
          getApiHealth(),
          getSensorReadings(),
          getAlerts(),
          getAiAnalyses(),
        ]);

      setApiStatus(healthData.status ?? "Unknown");
      setReadings(readingsData);
      setAlerts(alertsData);
      setAnalyses(analysesData);
    } catch {
      setApiStatus("Offline");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await clearAuth();
    onLogout?.();
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const latestReading = useMemo(() => {
    if (readings.length === 0) {
      return null;
    }

    return [...readings].sort(
      (a, b) =>
        new Date(b.createdAt ?? b.readingDate).getTime() -
        new Date(a.createdAt ?? a.readingDate).getTime()
    )[0];
  }, [readings]);

  const latestAnalysis = useMemo(() => {
    if (analyses.length === 0) {
      return null;
    }

    return [...analyses].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [analyses]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando painel...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Arujé Mobile</Text>
          <Text style={styles.title}>Painel</Text>
          <Text style={styles.subtitle}>Resumo da lavoura inteligente.</Text>
        </View>

        <Pressable style={styles.refreshButton} onPress={loadDashboard}>
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        <MetricCard
          label="Temperatura"
          value={formatValue(latestReading?.temperature, "°C")}
          status={getTemperatureStatus(latestReading?.temperature)}
        />

        <MetricCard
          label="Umidade do ar"
          value={formatValue(latestReading?.airHumidity, "%")}
          status="Normal"
        />

        <MetricCard
          label="Umidade do solo"
          value={formatValue(latestReading?.soilMoisture, "%")}
          status={getSoilStatus(latestReading?.soilMoisture)}
        />

        <MetricCard
          label="Luminosidade"
          value={formatValue(latestReading?.luminosity, "lux")}
          status="Monitorado"
        />
      </View>

      <View style={styles.systemCard}>
        <View>
          <Text style={styles.cardLabel}>Saúde da API</Text>
          <Text style={styles.systemValue}>{apiStatus}</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            {apiStatus === "Healthy" ? "Online" : "Verificar"}
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard label="Leituras" value={readings.length.toString()} />
        <SummaryCard label="Alertas" value={alerts.length.toString()} />
        <SummaryCard label="Análises IA" value={analyses.length.toString()} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Última análise com IA</Text>

        {latestAnalysis ? (
          <View style={styles.analysisCard}>
            <Text style={styles.riskLevel}>{latestAnalysis.riskLevel}</Text>
            <Text style={styles.analysisReason}>{latestAnalysis.reason}</Text>
            <Text style={styles.analysisRecommendation}>
              {latestAnalysis.recommendation}
            </Text>
            <Text style={styles.provider}>{latestAnalysis.provider}</Text>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Nenhuma análise gerada ainda. Gere dados pelo Wokwi para visualizar.
            </Text>
          </View>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  status: string;
};

function MetricCard({ label, value, status }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricStatus}>{status}</Text>
    </View>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
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

function getTemperatureStatus(value?: number | null) {
  if (value === null || value === undefined) {
    return "Sem dados";
  }

  if (value >= 35) {
    return "Alta";
  }

  return "Normal";
}

function getSoilStatus(value?: number | null) {
  if (value === null || value === undefined) {
    return "Sem dados";
  }

  if (value <= 20) {
    return "Baixa";
  }

  return "Ideal";
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "600",
  },
  metricValue: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },
  metricStatus: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  systemCard: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  systemValue: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusPillText: {
    color: colors.primaryDark,
    fontWeight: "800",
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: 16,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },
  summaryLabel: {
    color: "#DCE8D8",
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  analysisCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riskLevel: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF2D8",
    color: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "800",
    fontSize: 12,
  },
  analysisReason: {
    marginTop: 14,
    fontSize: 16,
    color: colors.text,
    fontWeight: "700",
    lineHeight: 22,
  },
  analysisRecommendation: {
    marginTop: 8,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  provider: {
    marginTop: 12,
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
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
    fontSize: 14,
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
});