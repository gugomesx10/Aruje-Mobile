import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Alert, getAlerts } from "../services/dashboardService";
import { colors } from "../theme/colors";

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAlerts() {
    try {
      setLoading(true);
      const data = await getAlerts();

      const ordered = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAlerts(ordered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Monitoramento</Text>
          <Text style={styles.title}>Alertas</Text>
          <Text style={styles.subtitle}>Ocorrências geradas automaticamente.</Text>
        </View>

        <Pressable style={styles.button} onPress={loadAlerts}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : alerts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Nenhum alerta encontrado.</Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <View key={alert.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{alert.title}</Text>
              <Text style={styles.pill}>{formatSeverity(alert.severity)}</Text>
            </View>

            <Text style={styles.description}>{alert.description}</Text>
            <Text style={styles.date}>{new Date(alert.createdAt).toLocaleString("pt-BR")}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function formatSeverity(value: string | number) {
  if (value === 1 || value === "1") return "Baixa";
  if (value === 2 || value === "2") return "Média";
  if (value === 3 || value === "3") return "Alta";
  if (value === 4 || value === "4") return "Crítica";

  return String(value);
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },
  pill: {
    backgroundColor: "#FFF2D8",
    color: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "900",
  },
  description: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    marginTop: 12,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
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
  },
});