import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  askRagAssistant,
  RagAskResponse,
  RagSourceResponse,
} from "../services/ragService";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

const DEFAULT_QUESTION = "Por que minha lavoura está em risco?";

export function RagAssistantScreen() {
  const navigation = useNavigation<any>();
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [response, setResponse] = useState<RagAskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAsk() {
    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length < 5) {
      setErrorMessage("Digite uma pergunta com pelo menos 5 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await askRagAssistant(trimmedQuestion, 8);

      setResponse(result);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Não foi possível consultar o assistente agora. Verifique se a API está online e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function getRiskStyle(riskLevel?: string) {
    const normalizedRisk = riskLevel?.toLowerCase();

    if (normalizedRisk === "alto") {
      return styles.riskHigh;
    }

    if (normalizedRisk === "médio" || normalizedRisk === "medio") {
      return styles.riskMedium;
    }

    if (normalizedRisk === "baixo") {
      return styles.riskLow;
    }

    return styles.riskUnknown;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        >
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
            <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="sparkles" size={26} color="#FFFFFF" />
          </View>

          <View style={styles.headerTextBox}>
            <Text style={styles.title}>Arujé IA</Text>
            <Text style={styles.subtitle}>
              Pergunte sobre riscos, alertas, sensores e recomendações da
              lavoura.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Pergunta</Text>

          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Ex: Por que minha lavoura está em risco?"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            style={styles.input}
          />

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#B91C1C"
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAsk}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Perguntar ao assistente</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {response ? (
          <View style={styles.responseCard}>
            <View style={styles.responseHeader}>
              <Text style={styles.responseTitle}>Resposta inteligente</Text>

              <View style={[styles.riskBadge, getRiskStyle(response.riskLevel)]}>
                <Text style={styles.riskBadgeText}>{response.riskLevel}</Text>
              </View>
            </View>

            <Text style={styles.answerText}>{response.answer}</Text>

            <View style={styles.recommendationBox}>
              <View style={styles.recommendationHeader}>
                <Ionicons name="leaf-outline" size={20} color={colors.primary} />
                <Text style={styles.recommendationTitle}>Recomendação</Text>
              </View>

              <Text style={styles.recommendationText}>
                {response.recommendation}
              </Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaText}>Provider: {response.provider}</Text>
              <Text style={styles.metaText}>
                Gerado em: {formatDate(response.generatedAt)}
              </Text>
            </View>

            <Text style={styles.sourcesTitle}>Fontes usadas pelo RAG</Text>

            {response.sources.map((source) => (
              <SourceCard key={`${source.type}-${source.id}`} source={source} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={34}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>Faça uma pergunta</Text>
            <Text style={styles.emptyText}>
              O assistente vai consultar leituras, alertas e análises IA do
              banco para responder com contexto real.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SourceCard({ source }: { source: RagSourceResponse }) {
  return (
    <View style={styles.sourceCard}>
      <View style={styles.sourceHeader}>
        <View style={styles.sourceTypeBox}>
          <Text style={styles.sourceType}>{source.type}</Text>
        </View>

        <Text style={styles.sourceScore}>
          Score {source.relevanceScore.toFixed(0)}
        </Text>
      </View>

      <Text style={styles.sourceTitle}>{source.title}</Text>
      <Text style={styles.sourceSummary}>{source.summary}</Text>

      <Text style={styles.sourceDate}>{formatDate(source.createdAt)}</Text>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 14,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextBox: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 10,
  },
  input: {
    minHeight: 110,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    padding: 14,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
    lineHeight: 22,
  },
  button: {
    marginTop: 14,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "700",
  },
  responseCard: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  responseTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  riskHigh: {
    backgroundColor: "#DC2626",
  },
  riskMedium: {
    backgroundColor: "#F59E0B",
  },
  riskLow: {
    backgroundColor: "#16A34A",
  },
  riskUnknown: {
    backgroundColor: "#64748B",
  },
  riskBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  answerText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#334155",
    fontWeight: "600",
  },
  recommendationBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#065F46",
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#047857",
    fontWeight: "700",
  },
  metaBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
  },
  sourcesTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
  },
  sourceCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  sourceTypeBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  sourceType: {
    fontSize: 12,
    fontWeight: "900",
    color: "#4338CA",
  },
  sourceScore: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
  },
  sourceTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6,
  },
  sourceSummary: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
    fontWeight: "600",
  },
  sourceDate: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
  },
  emptyState: {
    marginTop: 18,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginBottom: 16,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 999,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: colors.border,
},
backButtonText: {
fontSize: 14,
fontWeight: "900",
color: "#0F172A",
},
});