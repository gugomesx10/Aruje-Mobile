import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { SensorReading } from "../services/dashboardService";
import { colors } from "../theme/colors";
import { ChartPoint, LineChartCard } from "./LineChartCard";

type ReadingsChartsSectionProps = {
  readings: SensorReading[];
};

type SummaryTone = "success" | "warning" | "danger" | "neutral";

type TemporalSummary = {
  title: string;
  value: string;
  description: string;
  tone: SummaryTone;
};

export function ReadingsChartsSection({ readings }: ReadingsChartsSectionProps) {
  const navigation = useNavigation<any>();

  const latestReadings = readings.slice(0, 8).reverse();

  const temperatureData = buildChartData(latestReadings, [
    "temperature",
    "temperatura",
  ]);

  const humidityData = buildChartData(latestReadings, [
    "humidity",
    "airHumidity",
    "umidade",
  ]);

  const soilMoistureData = buildChartData(latestReadings, [
    "soilMoisture",
    "soilHumidity",
    "umidadeSolo",
  ]);

  const luminosityData = buildChartData(latestReadings, [
    "luminosity",
    "light",
    "luminosidade",
  ]);

  const temporalSummary = buildTemporalSummary(latestReadings);

  function handleAskAssistant() {
  navigation.navigate("RagAssistant", {
    initialQuestion:
    "Analise a evolução das últimas leituras IoT e me diga se minha lavoura está melhorando ou piorando. Considere temperatura, umidade do solo, umidade do ar, luminosidade, riscos recentes e ações recomendadas.",
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Evolução</Text>
        <Text style={styles.title}>Gráficos das leituras</Text>
        <Text style={styles.subtitle}>
          Visualização das últimas leituras recebidas pelos sensores IoT.
        </Text>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summarySectionTitle}>Resumo temporal</Text>

        <View style={styles.summaryGrid}>
          {temporalSummary.map((item) => (
            <TemporalSummaryCard key={item.title} item={item} />
          ))}
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
            Peça uma análise sobre a evolução das leituras e possíveis riscos.
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </Pressable>

      <LineChartCard
        title="Temperatura"
        subtitle="Variação nas últimas leituras"
        data={temperatureData}
        suffix="°C"
      />

      <LineChartCard
        title="Umidade do ar"
        subtitle="Percentual registrado pelos sensores"
        data={humidityData}
        suffix="%"
      />

      <LineChartCard
        title="Umidade do solo"
        subtitle="Indicador importante para irrigação"
        data={soilMoistureData}
        suffix="%"
      />

      <LineChartCard
        title="Luminosidade"
        subtitle="Intensidade de luz capturada"
        data={luminosityData}
        suffix="lux"
      />
    </View>
  );
}

function TemporalSummaryCard({ item }: { item: TemporalSummary }) {
  return (
    <View style={[styles.summaryCard, getSummaryToneStyle(item.tone)]}>
      <Text style={styles.summaryTitle}>{item.title}</Text>
      <Text style={styles.summaryValue}>{item.value}</Text>
      <Text style={styles.summaryDescription}>{item.description}</Text>
    </View>
  );
}

function buildTemporalSummary(readings: SensorReading[]): TemporalSummary[] {
  const temperatureTrend = getTrend(readings, ["temperature", "temperatura"], 0.5);

  const soilTrend = getTrend(
    readings,
    ["soilMoisture", "soilHumidity", "umidadeSolo"],
    1
  );

  const latestReading = readings[readings.length - 1];
  const worstReading = getWorstReading(readings);

  return [
    {
      title: "Temperatura",
      value: getTrendLabel(temperatureTrend),
      description: getTemperatureTrendDescription(temperatureTrend),
      tone: getTemperatureTrendTone(temperatureTrend),
    },
    {
      title: "Umidade do solo",
      value: getTrendLabel(soilTrend),
      description: getSoilTrendDescription(soilTrend),
      tone: getSoilTrendTone(soilTrend),
    },
    {
      title: "Última leitura",
      value: latestReading && isCritical(latestReading) ? "Risco" : "Normal",
      description:
        latestReading && isCritical(latestReading)
          ? "A leitura mais recente possui sinais de atenção."
          : "A leitura mais recente está dentro do esperado.",
      tone: latestReading && isCritical(latestReading) ? "danger" : "success",
    },
    {
      title: "Pior ponto",
      value: worstReading
        ? getReadingLabel(worstReading.record, worstReading.index)
        : "--",
      description: worstReading
        ? getWorstReadingDescription(worstReading.reading)
        : "Ainda não há dados suficientes para análise.",
      tone:
        worstReading && isCritical(worstReading.reading)
          ? "danger"
          : "neutral",
    },
  ];
}

function buildChartData(
  readings: SensorReading[],
  possibleKeys: string[]
): ChartPoint[] {
  return readings.map((reading, index) => {
    const record = reading as Record<string, unknown>;

    const value = possibleKeys
      .map((key) => record[key])
      .find((item) => item !== null && item !== undefined);

    return {
      label: getReadingLabel(record, index),
      value: value === null || value === undefined ? null : Number(value),
    };
  });
}

function getTrend(
  readings: SensorReading[],
  possibleKeys: string[],
  threshold: number
) {
  const values = readings
    .map((reading) => {
      const record = reading as Record<string, unknown>;

      const value = possibleKeys
        .map((key) => record[key])
        .find((item) => item !== null && item !== undefined);

      return value === null || value === undefined ? null : Number(value);
    })
    .filter((value): value is number => value !== null && !Number.isNaN(value));

  if (values.length < 2) {
    return "stable";
  }

  const first = values[0];
  const last = values[values.length - 1];
  const difference = last - first;

  if (difference > threshold) {
    return "up";
  }

  if (difference < -threshold) {
    return "down";
  }

  return "stable";
}

function getTrendLabel(trend: string) {
  if (trend === "up") {
    return "Subiu";
  }

  if (trend === "down") {
    return "Caiu";
  }

  return "Estável";
}

function getTemperatureTrendTone(trend: string): SummaryTone {
  if (trend === "up") {
    return "warning";
  }

  if (trend === "down") {
    return "success";
  }

  return "neutral";
}

function getSoilTrendTone(trend: string): SummaryTone {
  if (trend === "down") {
    return "danger";
  }

  if (trend === "up") {
    return "success";
  }

  return "neutral";
}

function getTemperatureTrendDescription(trend: string) {
  if (trend === "up") {
    return "A temperatura aumentou nas leituras recentes.";
  }

  if (trend === "down") {
    return "A temperatura diminuiu nas leituras recentes.";
  }

  return "A temperatura não teve grande variação.";
}

function getSoilTrendDescription(trend: string) {
  if (trend === "down") {
    return "A umidade do solo caiu, indicando possível necessidade de atenção.";
  }

  if (trend === "up") {
    return "A umidade do solo melhorou nas últimas leituras.";
  }

  return "A umidade do solo permaneceu relativamente estável.";
}

function getWorstReading(readings: SensorReading[]) {
  if (readings.length === 0) {
    return null;
  }

  return readings
    .map((reading, index) => ({
      reading,
      index,
      record: reading as Record<string, unknown>,
      score: getRiskScore(reading),
    }))
    .sort((a, b) => b.score - a.score)[0];
}

function getRiskScore(reading: SensorReading) {
  const temperature = reading.temperature ?? 0;
  const soilMoisture = reading.soilMoisture ?? 100;

  let score = 0;

  if (temperature >= 38) {
    score += 2;
  } else if (temperature >= 35) {
    score += 1;
  }

  if (soilMoisture <= 20) {
    score += 2;
  } else if (soilMoisture <= 25) {
    score += 1;
  }

  return score;
}

function getWorstReadingDescription(reading: SensorReading) {
  const temperature = reading.temperature ?? 0;
  const soilMoisture = reading.soilMoisture ?? 100;

  if (temperature >= 38 && soilMoisture <= 25) {
    return "Temperatura alta combinada com baixa umidade do solo.";
  }

  if (temperature >= 35) {
    return "Temperatura acima do ideal para a lavoura.";
  }

  if (soilMoisture <= 20) {
    return "Umidade do solo baixa, exigindo acompanhamento.";
  }

  return "Nenhum ponto crítico forte foi identificado.";
}

function isCritical(reading: SensorReading) {
  const temperature = reading.temperature ?? 0;
  const soilMoisture = reading.soilMoisture ?? 100;

  return temperature >= 35 || soilMoisture <= 20;
}

function getReadingLabel(record: Record<string, unknown>, index: number) {
  const rawDate =
    record.createdAt ??
    record.timestamp ??
    record.readAt ??
    record.date ??
    record.dataCriacao;

  if (!rawDate) {
    return `L${index + 1}`;
  }

  const date = new Date(String(rawDate));

  if (Number.isNaN(date.getTime())) {
    return `L${index + 1}`;
  }

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSummaryToneStyle(tone: SummaryTone) {
  if (tone === "success") {
    return styles.summarySuccess;
  }

  if (tone === "warning") {
    return styles.summaryWarning;
  }

  if (tone === "danger") {
    return styles.summaryDanger;
  }

  return styles.summaryNeutral;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 10,
  },
  header: {
    marginBottom: 14,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  summarySection: {
    marginBottom: 12,
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.primaryDark,
    marginBottom: 10,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryCard: {
    width: "48%",
    minHeight: 116,
    borderRadius: 20,
    padding: 13,
    borderWidth: 1,
  },
  summarySuccess: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },
  summaryWarning: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  summaryDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  summaryNeutral: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
  },
  summaryValue: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  summaryDescription: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: "#475569",
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