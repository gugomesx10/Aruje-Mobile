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

import { Alert as AlertModel, getAlerts } from "../services/dashboardService";
import { colors } from "../theme/colors";

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertModel[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAlerts() {
    try {
      setLoading(true);

      const data = await getAlerts();

      const ordered = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAlerts(ordered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  const criticalCount = alerts.filter((alert) =>
    isHighSeverity(alert.severity)
  ).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Monitoramento</Text>
            <Text style={styles.title}>Alertas</Text>
            <Text style={styles.subtitle}>
              Ocorrências geradas automaticamente pela plataforma.
            </Text>
          </View>

          <Pressable style={styles.refreshButton} onPress={loadAlerts}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.overviewCard}>
          <View>
            <Text style={styles.overviewLabel}>Alertas registrados</Text>
            <Text style={styles.overviewValue}>{alerts.length}</Text>
          </View>

          <View style={styles.overviewDivider} />

          <View>
            <Text style={styles.overviewLabel}>Alta prioridade</Text>
            <Text style={styles.overviewValue}>{criticalCount}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando alertas...</Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={38}
              color={colors.success}
            />
            <Text style={styles.emptyTitle}>Nenhum alerta encontrado</Text>
            <Text style={styles.emptyText}>
              Quando uma leitura crítica for processada, ela aparecerá aqui.
            </Text>
          </View>
        ) : (
          alerts.map((alert) => {
            const severity = getSeverityInfo(alert.severity);

            return (
              <View key={alert.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: severity.background },
                    ]}
                  >
                    <Ionicons
                      name={severity.icon}
                      size={22}
                      color={severity.color}
                    />
                  </View>

                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardTitle}>{alert.title}</Text>
                    <Text style={styles.date}>
                      {new Date(alert.createdAt).toLocaleString("pt-BR")}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.severityPill,
                      {
                        backgroundColor: severity.background,
                        color: severity.color,
                      },
                    ]}
                  >
                    {severity.label}
                  </Text>
                </View>

                <Text style={styles.description}>{alert.description}</Text>

                <View style={styles.footer}>
                  <View style={styles.footerItem}>
                    <MaterialCommunityIcons
                      name="timeline-alert-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.footerText}>Status: {alert.status}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

function isHighSeverity(value: string | number) {
  return value === 3 || value === "3" || value === 4 || value === "4";
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
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
  severityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "900",
  },
  description: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  footerItem: {
    backgroundColor: "#FAF8F1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },
});