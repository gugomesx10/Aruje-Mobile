import { useEffect, useRef, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

import {
  askRagAssistant,
  RagAskResponse,
  RagConversationMessageRequest,
  RagSourceResponse,
} from "../services/ragService";
import { colors } from "../theme/colors";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  response?: RagAskResponse;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    text:
      "Olá! Eu sou a Arujé IA, seu assistente virtual de monitoramento agrícola. " +
      "Posso te ajudar a entender alertas, riscos da lavoura, sensores e recomendações.",
  },
  {
    id: "welcome-2",
    role: "assistant",
    text:
      "Você pode escrever do seu jeito, mesmo sem saber o termo técnico. " +
      "Eu consulto os dados do Arujé e te explico de forma mais simples.",
  },
];

const SUGGESTED_QUESTIONS = [
  "Olá, tudo bem?",
  "Estou com dificuldade de entender os alertas, pode me ajudar?",
  "Tem algum alerta grave agora?",
  "Explique de forma simples o que aconteceu.",
  "O que eu devo fazer agora?",
];

export function RagAssistantScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  async function handleAsk(customQuestion?: string) {
  const selectedQuestion = (customQuestion ?? question).trim();

  if (selectedQuestion.length < 2 || loading) {
    return;
  }

  const conversationHistory = buildConversationHistory(messages);

  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    text: selectedQuestion,
  };

  setMessages((current) => [...current, userMessage]);
  setQuestion("");
  setLoading(true);

  try {
    const result = await askRagAssistant(
      selectedQuestion,
      conversationHistory,
      8
    );

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: buildFriendlyAnswer(result),
      response: result,
    };

    setMessages((current) => [...current, assistantMessage]);
  } catch (error) {
    console.error(error);

    const errorMessage: ChatMessage = {
      id: `assistant-error-${Date.now()}`,
      role: "assistant",
      text:
        "Não consegui consultar os dados agora. Verifique se a API está online e tente novamente.",
    };

    setMessages((current) => [...current, errorMessage]);
  } finally {
    setLoading(false);
  }
}

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.headerTextBox}>
          <Text style={styles.title}>Arujé IA</Text>
          <Text style={styles.subtitle}>Atendimento virtual agrícola</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {messages.length === INITIAL_MESSAGES.length ? (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionsTitle}>Você pode perguntar:</Text>

            {SUGGESTED_QUESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                activeOpacity={0.85}
                style={styles.suggestionButton}
                onPress={() => handleAsk(suggestion)}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={17}
                  color={colors.primary}
                />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {loading ? (
          <View style={styles.assistantRow}>
            <View style={styles.smallAvatar}>
              <Ionicons name="sparkles" size={15} color="#FFFFFF" />
            </View>

            <View style={styles.typingBubble}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.typingText}>Arujé IA analisando dados...</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Digite sua dúvida..."
          placeholderTextColor="#94A3B8"
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={() => handleAsk()}
          disabled={loading}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantRow}>
      <View style={styles.smallAvatar}>
        <Ionicons name="sparkles" size={15} color="#FFFFFF" />
      </View>

      <View style={styles.assistantBubble}>
        <Text style={styles.assistantText}>{message.text}</Text>

        {message.response && message.response.sources.length > 0 ? (
          <View style={styles.responseDetails}>
            <View style={[styles.riskBadge, getRiskStyle(message.response.riskLevel)]}>
              <Text style={styles.riskBadgeText}>
                Risco {message.response.riskLevel}
              </Text>
            </View>

            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationTitle}>Recomendação</Text>
              <Text style={styles.recommendationText}>
                {message.response.recommendation}
              </Text>
            </View>

            <Text style={styles.sourcesTitle}>Fontes consultadas</Text>

            {message.response.sources.slice(0, 2).map((source) => (
              <SourceItem
                key={`${source.type}-${source.id}`}
                source={source}
              />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function buildConversationHistory(
  messages: ChatMessage[]
): RagConversationMessageRequest[] {
  return messages
    .filter((message) => !message.id.startsWith("welcome-"))
    .filter((message) => message.text.trim().length > 0)
    .slice(-6)
    .map((message) => ({
      role: message.role,
      content: truncateText(
        message.response?.answer ?? message.text,
        1000
      ),
    }));
}

function truncateText(value: string, maxLength: number) {
  const cleanValue = value.trim();

  if (cleanValue.length <= maxLength) {
    return cleanValue;
  }

  return cleanValue.slice(0, maxLength).trim();
}

function SourceItem({ source }: { source: RagSourceResponse }) {
  return (
    <View style={styles.sourceItem}>
      <View style={styles.sourceHeader}>
        <Text style={styles.sourceType}>{source.type}</Text>
        <Text style={styles.sourceScore}>Score {source.relevanceScore}</Text>
      </View>

      <Text style={styles.sourceTitle}>{source.title}</Text>
      <Text style={styles.sourceSummary}>{source.summary}</Text>
    </View>
  );
}

function buildFriendlyAnswer(response: RagAskResponse) {
  return response.answer;
}

function getConversationalAnswer(question: string) {
  const normalizedQuestion = normalizeText(question);

  if (
    containsAny(
      normalizedQuestion,
      "oi",
      "ola",
      "olá",
      "tudo bem",
      "bom dia",
      "boa tarde",
      "boa noite",
      "eai",
      "e ai"
    )
  ) {
    return (
      "Olá! Tudo bem? Eu sou a Arujé IA. " +
      "Estou aqui para te ajudar a entender sua lavoura de forma simples. " +
      "Você pode me perguntar sobre alertas, riscos, sensores ou o que fazer agora."
    );
  }

  if (
    containsAny(
      normalizedQuestion,
      "preciso de ajuda",
      "pode me ajudar",
      "estou com dificuldade",
      "nao entendi",
      "não entendi",
      "explica melhor",
      "me ajuda",
      "tenho dificuldade"
    )
  ) {
    return (
      "Claro, eu te ajudo. Pode escrever do seu jeito, mesmo sem usar termos técnicos. " +
      "Por exemplo, você pode perguntar: “tem algum alerta grave?”, “o que eu faço agora?” " +
      "ou “explique de forma simples o que aconteceu”."
    );
  }

  if (
    containsAny(
      normalizedQuestion,
      "o que voce faz",
      "o que você faz",
      "como voce funciona",
      "como você funciona",
      "quem e voce",
      "quem é você"
    )
  ) {
    return (
      "Eu sou um assistente virtual do Arujé. " +
      "Eu consulto os dados do sistema, como leituras IoT, alertas e análises inteligentes, " +
      "para explicar o que está acontecendo com a lavoura e sugerir uma ação."
    );
  }

  return null;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function containsAny(text: string, ...terms: string[]) {
  return terms.some((term) => text.includes(normalizeText(term)));
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextBox: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    padding: 18,
    paddingBottom: 24,
  },
  assistantRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 9,
  },
  userRow: {
    alignItems: "flex-end",
    marginBottom: 14,
  },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  assistantBubble: {
    flex: 1,
    maxWidth: "82%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 14,
},
  userBubble: {
    maxWidth: "72%",
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 14,
  },
  assistantText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
    fontWeight: "600",
  },
  userText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  suggestionsBox: {
    marginTop: 4,
    marginLeft: 39,
    marginBottom: 18,
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 2,
  },
  suggestionButton: {
    alignSelf: "flex-start",
    maxWidth: "96%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  suggestionText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  typingBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typingText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
  },
  responseDetails: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  riskBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
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
  recommendationBox: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#065F46",
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: "#047857",
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
  },
  sourceItem: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 11,
    marginBottom: 8,
  },
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 5,
  },
  sourceType: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.primary,
  },
  sourceScore: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.muted,
  },
  sourceTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },
  sourceSummary: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    color: "#475569",
  },
  composer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 26 : 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 46,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.65,
  },
});