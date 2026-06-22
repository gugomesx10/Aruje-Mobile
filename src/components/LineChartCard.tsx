import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";

import { colors } from "../theme/colors";

export type ChartPoint = {
  label: string;
  value: number | null;
};

type LineChartCardProps = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
  suffix?: string;
};

export function LineChartCard({
  title,
  subtitle,
  data,
  suffix = "",
}: LineChartCardProps) {
  const validData = data.filter(
    (item) => typeof item.value === "number" && !Number.isNaN(item.value)
  ) as Array<{ label: string; value: number }>;

  if (validData.length < 2) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Gere mais leituras IoT para visualizar este gráfico.
          </Text>
        </View>
      </View>
    );
  }

  const width = 300;
  const height = 140;
  const padding = 22;

  const values = validData.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const xStep =
    validData.length > 1
      ? (width - padding * 2) / (validData.length - 1)
      : width - padding * 2;

  const points = validData.map((item, index) => {
    const x = padding + index * xStep;
    const normalized = (item.value - min) / range;
    const y = height - padding - normalized * (height - padding * 2);

    return {
      x,
      y,
      label: item.label,
      value: item.value,
    };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  const latest = validData[validData.length - 1];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {formatNumber(latest.value)}
            {suffix}
          </Text>
        </View>
      </View>

      <View style={styles.chartBox}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="#E5E0D2"
            strokeWidth="1"
          />
          <Line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#E5E0D2"
            strokeWidth="1"
          />
          <Line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#E5E0D2"
            strokeWidth="1"
          />

          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={colors.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <Circle
              key={`${point.label}-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors.primaryDark}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Mín: {formatNumber(min)}
          {suffix}
        </Text>

        <Text style={styles.footerText}>
          Máx: {formatNumber(max)}
          {suffix}
        </Text>
      </View>
    </View>
  );
}

function formatNumber(value: number) {
  return Number(value.toFixed(1)).toString();
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
  },
  chartBox: {
    marginTop: 14,
  },
  footer: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyBox: {
    marginTop: 16,
    backgroundColor: "#FAF8F1",
    borderRadius: 18,
    padding: 18,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});