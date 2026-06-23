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

import { Alert as AlertModel } from "../services/dashboardService";
import { colors } from "../theme/colors";

type AlertDetailsRouteParams = {
  AlertDetails: {
    alert: AlertModel;
  };
};

export function AlertDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AlertDetailsRouteParams, "AlertDetails">>();

  const { alert } = route.params;
  const severity = getSeverityInfo(alert.severity);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Alerta</Text>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.subtitle}>
              Detalhamento da ocorrência gerada pela plataforma.
            </Text>
          </View>
        </View>

        <View style={[styles.statusCard, { borderColor: severity.background }]}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: severity.background },
            ]}
          >
            <Ionicons name={severity.icon} size={28} color={severity.color} />
          </View>

          <View style={styles.statusTextBox}>
            <Text style={styles.statusLabel}>Severidade</Text>
            <Text style={[styles.statusTitle, { color: severity.color }]}>
              {severity.label}
            </Text>
            <Text style={styles.statusDescription}>
              {getSeverityDescription(alert.severity)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descrição</Text>
          <Text style={styles.description}>{alert.description}</Text>
        </View>

        <View style={styles.grid}>
          <MetricCard
            icon={
              <MaterialCommunityIcons
                name="timeline-alert-outline"
                size={22}
                color={colors.primary}
              />
            }
            label="Status"
            value={String(alert.status)}
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
            value={formatDate(alert.createdAt)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações técnicas</Text>

          <InfoRow label="ID" value={alert.id} />
          <InfoRow label="Título" value={alert.title} />
          <InfoRow label="Status" value={String(alert.status)} />
          <InfoRow label="Severidade" value={severity.label} />
          <InfoRow label="Criado em" value={formatDate(alert.createdAt)} />
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

function getSeverityDescription(value: string | number) {
  if (value === 1 || value === "1" || value === "Low") {
    return "Alerta de baixa prioridade. Deve ser acompanhado, mas não indica risco imediato.";
  }

  if (value === 2 || value === "2" || value === "Medium") {
    return "Alerta de prioridade média. Recomenda atenção aos próximos dados recebidos.";
  }

  if (value === 3 || value === "3" || value === "High") {
    return "Alerta de alta prioridade. Pode indicar condição desfavorável para a lavoura.";
  }

  if (value === 4 || value === "4" || value === "Critical") {
    return "Alerta crítico. Recomenda ação rápida para evitar prejuízo ou estresse da plantação.";
  }

  return "Alerta gerado automaticamente pela plataforma.";
}

function getSeverityInfo(value: string | number): {
  label: string;
  color: string;
  background: string;
  icon: keyof typeof Ionicons.glyphMap;
} {
  if (value === 1 || value === "1" || value === "Low") {
    return {
      label: "Baixa",
      color: colors.success,
      background: "#E5F4E8",
      icon: "information-circle-outline",
    };
  }

  if (value === 2 || value === "2" || value === "Medium") {
    return {
      label: "Média",
      color: colors.warning,
      background: "#FFF2D8",
      icon: "alert-circle-outline",
    };
  }

  if (value === 3 || value === "3" || value === "High") {
    return {
      label: "Alta",
      color: "#C96B00",
      background: "#FFE7C2",
      icon: "warning-outline",
    };
  }

  if (value === 4 || value === "4" || value === "Critical") {
    return {
      label: "Crítica",
      color: colors.danger,
      background: "#FDE2DE",
      icon: "flame-outline",
    };
  }

  return {
    label: String(value),
    color: colors.primary,
    background: colors.primaryLight,
    icon: "alert-circle-outline",
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
  description: {
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