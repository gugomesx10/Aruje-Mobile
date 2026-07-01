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

import { SensorReading } from "../services/dashboardService";
import { colors } from "../theme/colors";

type ReadingDetailsRouteParams = {
  ReadingDetails: {
    reading: SensorReading;
    title: string;
  };
};

export function ReadingDetailsScreen() {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<ReadingDetailsRouteParams, "ReadingDetails">>();

  const { reading, title } = route.params;

  const critical = isCritical(reading);


  function handleAskAssistant() {
  navigation.navigate("RagAssistant", {
    initialQuestion:
      `Explique esta leitura IoT de forma simples e diga se existe risco para a lavoura. ` +
      `Leitura: ${title}. ` +
      `Temperatura: ${formatValue(reading.temperature, "°C")}. ` +
      `Umidade do ar: ${formatValue(reading.airHumidity, "%")}. ` +
      `Umidade do solo: ${formatValue(reading.soilMoisture, "%")}. ` +
      `Luminosidade: ${formatValue(reading.luminosity, "lux")}. ` +
      `Status identificado no app: ${critical ? "risco detectado" : "condição normal"}.`,
  });
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Leitura IoT</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Dados detalhados recebidos pela simulação IoT.
            </Text>
          </View>
        </View>

        <View style={[styles.statusCard, critical && styles.statusCardDanger]}>
          <Ionicons
            name={critical ? "warning-outline" : "checkmark-circle-outline"}
            size={28}
            color={critical ? colors.danger : colors.success}
          />

          <View style={styles.statusTextBox}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={[styles.statusTitle, critical && styles.statusDangerText]}>
              {critical ? "Risco detectado" : "Condição normal"}
            </Text>
            <Text style={styles.statusDescription}>
              {critical
                ? "Esta leitura possui valores fora do intervalo ideal."
                : "Esta leitura não apresenta risco crítico."}
            </Text>
          </View>
        </View>

        <Pressable style={styles.assistantActionCard} onPress={handleAskAssistant}>
          <View style={styles.assistantActionIcon}>
            <Ionicons name="sparkles" size={22} color="#FFFFFF" />
          </View>

          <View style={styles.assistantActionTextBox}>
            <Text style={styles.assistantActionTitle}>
            Perguntar para Arujé IA
            </Text>
            <Text style={styles.assistantActionSubtitle}>
            Peça uma explicação simples sobre esta leitura e possíveis riscos.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.grid}>
          <MetricCard
            icon={
              <MaterialCommunityIcons
                name="thermometer"
                size={22}
                color={colors.primary}
              />
            }
            label="Temperatura"
            value={formatValue(reading.temperature, "°C")}
          />

          <MetricCard
            icon={<Ionicons name="water-outline" size={22} color={colors.primary} />}
            label="Umidade ar"
            value={formatValue(reading.airHumidity, "%")}
          />

          <MetricCard
            icon={
              <MaterialCommunityIcons
                name="sprout"
                size={22}
                color={colors.primary}
              />
            }
            label="Umidade solo"
            value={formatValue(reading.soilMoisture, "%")}
          />

          <MetricCard
            icon={<Ionicons name="sunny-outline" size={22} color={colors.warning} />}
            label="Luminosidade"
            value={formatValue(reading.luminosity, "lux")}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações</Text>

          <InfoRow label="ID" value={reading.id} />
          <InfoRow
            label="Data"
            value={formatDate(reading.createdAt ?? reading.readingDate)}
          />
          <InfoRow
            label="Temperatura crítica"
            value={(reading.temperature ?? 0) >= 35 ? "Sim" : "Não"}
          />
          <InfoRow
            label="Solo em risco"
            value={(reading.soilMoisture ?? 100) <= 20 ? "Sim" : "Não"}
          />
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

function formatValue(value?: number | null, suffix?: string) {
  if (value === null || value === undefined) {
    return "--";
  }

  if (suffix === "lux") {
    return `${Math.round(value)} ${suffix}`;
  }

  return `${Number(value).toFixed(1)} ${suffix}`;
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

function isCritical(reading: SensorReading) {
  const temperature = reading.temperature ?? 0;
  const soilMoisture = reading.soilMoisture ?? 100;

  return temperature >= 35 || soilMoisture <= 20;
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
    fontSize: 30,
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
    backgroundColor: "#F0F8EF",
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: "#D7EED2",
  },
  statusCardDanger: {
    backgroundColor: "#FFF1EE",
    borderColor: "#F5C9BE",
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
    color: colors.success,
    fontSize: 18,
    fontWeight: "900",
  },
  statusDangerText: {
    color: colors.danger,
  },
  statusDescription: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
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
    fontSize: 20,
    fontWeight: "900",
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
  assistantActionCard: {
  backgroundColor: colors.primary,
  borderRadius: 24,
  padding: 16,
  marginBottom: 14,
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  shadowColor: "#000",
  shadowOpacity: 0.14,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
},
assistantActionIcon: {
  width: 44,
  height: 44,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.18)",
  alignItems: "center",
  justifyContent: "center",
},
assistantActionTextBox: {
  flex: 1,
},
assistantActionTitle: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "900",
},
assistantActionSubtitle: {
  marginTop: 3,
  color: "rgba(255,255,255,0.84)",
  fontSize: 12,
  lineHeight: 17,
  fontWeight: "700",
},
});