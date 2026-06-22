import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { AiAnalysis, getAiAnalyses } from "../services/dashboardService";
import { colors } from "../theme/colors";

export function AnalysesScreen() {
  const navigation = useNavigation<any>();

  const [analyses, setAnalyses] = useState<AiAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnalyses() {
    try {
      setLoading(true);

      const data = await getAiAnalyses();

      const ordered = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAnalyses(ordered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyses();
  }, []);

  const highRiskCount = analyses.filter((analysis) =>
    isHighRisk(analysis.riskLevel)
  ).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Inteligência</Text>
            <Text style={styles.title}>Análises IA</Text>
            <Text style={styles.subtitle}>
              Recomendações automáticas baseadas nas leituras da lavoura.
            </Text>
          </View>

          <Pressable style={styles.refreshButton} onPress={loadAnalyses}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="sparkles" size={26} color={colors.primaryDark} />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>Análises geradas</Text>
            <Text style={styles.heroValue}>{analyses.length}</Text>
            <Text style={styles.heroDescription}>
              {highRiskCount} análise(s) com risco elevado identificada(s).
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando análises...</Text>
          </View>
        ) : analyses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles-outline" size={38} color={colors.primary} />
            <Text style={styles.emptyTitle}>Nenhuma análise encontrada</Text>
            <Text style={styles.emptyText}>
              Rode o Wokwi para gerar leituras críticas e visualizar as
              recomendações automáticas.
            </Text>
          </View>
        ) : (
          analyses.map((analysis) => {
            const risk = getRiskInfo(analysis.riskLevel);

            return (
              <Pressable
                key={analysis.id}
                style={({ pressed }) => [
                  styles.card,
                  pressed ? styles.cardPressed : null,
                ]}
                onPress={() =>
                  navigation.navigate("AnalysisDetails", {
                    analysis,
                  })
                }
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: risk.background },
                    ]}
                  >
                    <Ionicons name={risk.icon} size={22} color={risk.color} />
                  </View>

                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardTitle}>
                      Recomendação inteligente
                    </Text>
                    <Text style={styles.date}>
                      {new Date(analysis.createdAt).toLocaleString("pt-BR")}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.riskPill,
                      {
                        backgroundColor: risk.background,
                        color: risk.color,
                      },
                    ]}
                  >
                    {risk.label}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Motivo</Text>
                  <Text style={styles.reason}>{analysis.reason}</Text>
                </View>

                <View style={styles.recommendationBox}>
                  <View style={styles.recommendationIcon}>
                    <MaterialCommunityIcons
                      name="lightbulb-on-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.recommendationContent}>
                    <Text style={styles.sectionLabel}>Recomendação</Text>
                    <Text style={styles.recommendation}>
                      {analysis.recommendation}
                    </Text>
                  </View>
                </View>

                <View style={styles.footer}>
                  <View style={styles.providerPill}>
                    <Ionicons
                      name="hardware-chip-outline"
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.provider}>{analysis.provider}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

function isHighRisk(value: string) {
  return value === "High" || value === "Critical";
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
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#DDEED8",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    color: "#DCE8D8",
    fontSize: 13,
    fontWeight: "700",
  },
  heroValue: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },
  heroDescription: {
    marginTop: 4,
    color: "#E9F1E5",
    fontSize: 13,
    lineHeight: 18,
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
  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "900",
  },
  section: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "900",
    marginBottom: 6,
  },
  reason: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },
  recommendationBox: {
    marginTop: 14,
    backgroundColor: "#FAF8F1",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  recommendationIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
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
  footer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  providerPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  provider: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
});