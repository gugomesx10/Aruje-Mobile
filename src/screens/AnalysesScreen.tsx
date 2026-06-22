import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AiAnalysis, getAiAnalyses } from "../services/dashboardService";
import { colors } from "../theme/colors";

export function AnalysesScreen() {
  const [analyses, setAnalyses] = useState<AiAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnalyses() {
    try {
      setLoading(true);
      const data = await getAiAnalyses();

      const ordered = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAnalyses(ordered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyses();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Inteligência</Text>
          <Text style={styles.title}>Análises IA</Text>
          <Text style={styles.subtitle}>Recomendações automáticas da lavoura.</Text>
        </View>

        <Pressable style={styles.button} onPress={loadAnalyses}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : analyses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Nenhuma análise encontrada.</Text>
        </View>
      ) : (
        analyses.map((analysis) => (
          <View key={analysis.id} style={styles.card}>
            <Text style={styles.risk}>{analysis.riskLevel}</Text>
            <Text style={styles.reason}>{analysis.reason}</Text>
            <Text style={styles.recommendation}>{analysis.recommendation}</Text>

            <View style={styles.footer}>
              <Text style={styles.provider}>{analysis.provider}</Text>
              <Text style={styles.date}>
                {new Date(analysis.createdAt).toLocaleString("pt-BR")}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
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
  risk: {
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
  reason: {
    marginTop: 14,
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23,
  },
  recommendation: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  provider: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  date: {
    color: colors.muted,
    fontSize: 12,
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