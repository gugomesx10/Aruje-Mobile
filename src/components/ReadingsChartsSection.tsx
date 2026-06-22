import { StyleSheet, Text, View } from "react-native";

import { SensorReading } from "../services/dashboardService";
import { colors } from "../theme/colors";
import { ChartPoint, LineChartCard } from "./LineChartCard";

type ReadingsChartsSectionProps = {
  readings: SensorReading[];
};

export function ReadingsChartsSection({ readings }: ReadingsChartsSectionProps) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Evolução</Text>
        <Text style={styles.title}>Gráficos das leituras</Text>
        <Text style={styles.subtitle}>
          Visualização das últimas leituras recebidas pelos sensores IoT.
        </Text>
      </View>

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
        suffix="%"
      />
    </View>
  );
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
});