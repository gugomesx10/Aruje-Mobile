import { ReactNode } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { AiAnalysis } from "../services/dashboardService";
import { colors } from "../theme/colors";

type AnalysisDetailsRouteParams = {
  AnalysisDetails: {
    analysis: AiAnalysis;
  };
};

export function AnalysisDetailsScreen() {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<AnalysisDetailsRouteParams, "AnalysisDetails">>();

  const { analysis } = route.params;
  const risk = getRiskInfo(analysis.riskLevel);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Análise IA</Text>
            <Text style={styles.title}>Recomendação inteligente</Text>
            <Text style={styles.subtitle}>
              Interpretação automática dos dados agrícolas processados.
            </Text>
          </View>
        </View>

        <View style={[styles.statusCard, { borderColor: risk.background }]}>
          <View style={[styles.statusIcon, { backgroundColor: risk.background }]}>
            <Ionicons name={risk.icon} size={28} color={risk.color} />
          </View>

          <View style={styles.statusTextBox}>
            <Text style={styles.statusLabel}>Nível de risco</Text>
            <Text style={[styles.statusTitle, { color: risk.color }]}>
              {risk.label}
            </Text>
            <Text style={styles.statusDescription}>
              {getRiskDescription(analysis.riskLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Motivo da análise</Text>
          <Text style={styles.reason}>{analysis.reason}</Text>
        </View>

        <View style={styles.recommendationCard}>
          <View style={styles.recommendationIcon}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.recommendationContent}>
            <Text style={styles.cardTitle}>Recomendação</Text>
            <Text style={styles.recommendation}>
              {analysis.recommendation}
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <MetricCard
            icon={
              <Ionicons
                name="hardware-chip-outline"
                size={22}
                color={colors.primary}
              />
            }
            label="Provider"
            value={analysis.provider}
          />

          <MetricCard
            icon={
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.primary}
              />
            }
            label="Criado em"
            value={formatDate(analysis.createdAt)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações técnicas</Text>

          <InfoRow label="ID" value={analysis.id} />
          <InfoRow label="Risco" value={risk.label} />
          <InfoRow label="Provider" value={analysis.provider} />
          <InfoRow label="Criado em" value={formatDate(analysis.createdAt)} />
        </View>
      </View>
    </ScrollView>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>{icon}</View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
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

function getRiskDescription(value: string) {
  if (value === "Low") {
    return "Baixo risco identificado. A lavoura está em condição estável.";
  }

  if (value === "Medium") {
    return "Risco moderado. Recomenda acompanhar as próximas leituras.";
  }

  if (value === "High") {
    return "Risco alto. A condição da lavoura exige atenção.";
  }

  if (value === "Critical") {
    return "Risco crítico. Recomenda ação rápida para evitar prejuízo.";
  }

  return "Análise gerada automaticamente com base nos dados disponíveis.";
}

function getRiskInfo(value: string): {
  label: string;
  color: string;
  background: string;
  icon: keyof typeof Ionicons.glyphMap;
} {
  if (value === "Low") {
    return {
      label: "Baixo",
      color: colors.success,
      background: "#E5F4E8",
      icon: "checkmark-circle-outline",
    };
  }

  if (value === "Medium") {
    return {
      label: "Médio",
      color: colors.warning,
      background: "#FFF2D8",
      icon: "alert-circle-outline",
    };
  }

  if (value === "High") {
    return {
      label: "Alto",
      color: "#C96B00",
      background: "#FFE7C2",
      icon: "warning-outline",
    };
  }

  if (value === "Critical") {
    return {
      label: "Crítico",
      color: colors.danger,
      background: "#FDE2DE",
      icon: "flame-outline",
    };
  }

  return {
    label: value,
    color: colors.primary,
    background: colors.primaryLight,
    icon: "sparkles-outline",
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
    gap: 12,
    alignItems: "flex-start",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 28,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
  },
  statusIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTextBox: {
    flex: 1,
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  statusTitle: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: "900",
  },
  statusDescription: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  reason: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },
  recommendationCard: {
    backgroundColor: "#FAF8F1",
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendationIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendationContent: {
    flex: 1,
  },
  recommendation: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  metricValue: {
    marginTop: 5,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
});