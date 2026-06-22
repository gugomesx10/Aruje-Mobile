import { useEffect, useMemo, useState, type ReactNode } from "react";
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
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Arujé Mobile</Text>
            <Text style={styles.title}>Olá, Produtor!</Text>
            <Text style={styles.subtitle}>
              Resumo inteligente da sua lavoura.
            </Text>
          </View>

          <Pressable style={styles.logoutIconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Saúde do sistema</Text>
              <Text style={styles.heroValue}>{apiStatus}</Text>
            </View>

            <View style={styles.onlinePill}>
              <Ionicons name="pulse" size={14} color={colors.primaryDark} />
              <Text style={styles.onlinePillText}>
                {apiStatus === "Healthy" ? "Online" : "Verificar"}
              </Text>
            </View>
          </View>

          <Text style={styles.heroDescription}>
            API conectada, autenticação ativa e dados IoT sincronizados.
          </Text>
        </View>

        <View style={styles.grid}>
          <MetricCard
            icon={
              <MaterialCommunityIcons
                name="thermometer"
                size={24}
                color={colors.primary}
              />
            }
            label="Temperatura"
            value={formatValue(latestReading?.temperature, "°C")}
            status={getTemperatureStatus(latestReading?.temperature)}
          />

          <MetricCard
            icon={
              <Ionicons name="water-outline" size={24} color={colors.primary} />
            }
            label="Umidade do ar"
            value={formatValue(latestReading?.airHumidity, "%")}
            status="Normal"
          />

          <MetricCard
            icon={
              <MaterialCommunityIcons
                name="sprout"
                size={24}
                color={colors.primary}
              />
            }
            label="Umidade do solo"
            value={formatValue(latestReading?.soilMoisture, "%")}
            status={getSoilStatus(latestReading?.soilMoisture)}
          />

          <MetricCard
            icon={
              <Ionicons name="sunny-outline" size={24} color={colors.warning} />
            }
            label="Luminosidade"
            value={formatValue(latestReading?.luminosity, "lux")}
            status="Monitorado"
          />
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard label="Leituras" value={readings.length.toString()} />
          <SummaryCard label="Alertas" value={alerts.length.toString()} />
          <SummaryCard label="Análises IA" value={analyses.length.toString()} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Última análise com IA</Text>

          <Pressable onPress={loadDashboard}>
            <Text style={styles.refreshText}>Atualizar</Text>
          </Pressable>
        </View>

        {latestAnalysis ? (
          <View style={styles.analysisCard}>
            <View style={styles.analysisIcon}>
              <Ionicons name="sparkles" size={22} color={colors.primary} />
            </View>

            <View style={styles.analysisContent}>
              <Text style={styles.riskLevel}>{latestAnalysis.riskLevel}</Text>

              <Text style={styles.analysisReason}>
                {latestAnalysis.reason}
              </Text>

              <Text style={styles.analysisRecommendation}>
                {latestAnalysis.recommendation}
              </Text>

              <Text style={styles.provider}>{latestAnalysis.provider}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Nenhuma análise gerada ainda. Rode o Wokwi para visualizar.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  status: string;
};

function MetricCard({ icon, label, value, status }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>{icon}</View>

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
    padding: 18,
    paddingBottom: 40,
  },
  page: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
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
    marginTop: 18,
    marginBottom: 18,
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
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 15,
    color: colors.muted,
  },
  logoutIconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  heroLabel: {
    color: "#DCE8D8",
    fontSize: 13,
    fontWeight: "700",
  },
  heroValue: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },
  heroDescription: {
    marginTop: 16,
    color: "#E9F1E5",
    fontSize: 14,
    lineHeight: 20,
  },
  onlinePill: {
    backgroundColor: "#DDEED8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  onlinePillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    minHeight: 160,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  metricIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "700",
  },
  metricValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "900",
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
    fontWeight: "900",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: "900",
  },
  summaryLabel: {
    color: colors.muted,
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  refreshText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  analysisCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    gap: 14,
  },
  analysisIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  analysisContent: {
    flex: 1,
  },
  riskLevel: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF2D8",
    color: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "900",
    fontSize: 12,
  },
  analysisReason: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
    fontWeight: "900",
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
    fontSize: 14,
    lineHeight: 20,
  },
});