import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

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

type Trend = "up" | "down" | "stable";

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
          <Text style={styles.emptyTitle}>Dados insuficientes</Text>
          <Text style={styles.emptyText}>
            Gere mais leituras IoT para visualizar a evolução deste indicador.
          </Text>
        </View>
      </View>
    );
  }

  const width = 300;
  const height = 150;
  const padding = 24;

  const values = validData.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const first = validData[0];
  const latest = validData[validData.length - 1];
  const variation = latest.value - first.value;
  const trend = getTrend(variation);

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

  const linePath = buildSmoothPath(points);
  const areaPath = buildAreaPath(points, height, padding);
  const latestPoint = points[points.length - 1];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Último</Text>
          <Text style={styles.badgeText}>
            {formatValue(latest.value, suffix)}
          </Text>
        </View>
      </View>

      <View style={styles.trendRow}>
        <View style={[styles.trendPill, getTrendPillStyle(trend)]}>
          <Text style={[styles.trendText, getTrendTextStyle(trend)]}>
            {getTrendLabel(trend)}
          </Text>
        </View>

        <Text style={styles.trendDescription}>
          Variação de {formatSignedValue(variation, suffix)} nas últimas leituras.
        </Text>
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

          <Path
            d={areaPath}
            fill={colors.primary}
            fillOpacity={0.08}
          />

          <Path
            d={linePath}
            fill="none"
            stroke={colors.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => {
            const isLatest = index === points.length - 1;

            return (
              <Circle
                key={`${point.label}-${index}`}
                cx={point.x}
                cy={point.y}
                r={isLatest ? "6" : "4"}
                fill={isLatest ? colors.primary : colors.primaryDark}
                stroke={isLatest ? "#FFFFFF" : colors.primaryDark}
                strokeWidth={isLatest ? "3" : "0"}
              />
            );
          })}

          <Circle
            cx={latestPoint.x}
            cy={latestPoint.y}
            r="10"
            fill={colors.primary}
            fillOpacity={0.12}
          />
        </Svg>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Mínimo</Text>
          <Text style={styles.footerText}>{formatValue(min, suffix)}</Text>
        </View>

        <View style={styles.footerCenter}>
          <Text style={styles.footerLabel}>Máximo</Text>
          <Text style={styles.footerText}>{formatValue(max, suffix)}</Text>
        </View>

        <View style={styles.footerRight}>
          <Text style={styles.footerLabel}>Variação</Text>
          <Text style={styles.footerText}>
            {formatSignedValue(variation, suffix)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    const controlX = (previous.x + current.x) / 2;

    path += ` C ${controlX} ${previous.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

function buildAreaPath(
  points: Array<{ x: number; y: number }>,
  height: number,
  padding: number
) {
  if (points.length === 0) {
    return "";
  }

  const bottomY = height - padding;
  const first = points[0];
  const last = points[points.length - 1];
  const linePath = buildSmoothPath(points);

  return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
}

function getTrend(variation: number): Trend {
  if (variation > 0.5) {
    return "up";
  }

  if (variation < -0.5) {
    return "down";
  }

  return "stable";
}

function getTrendLabel(trend: Trend) {
  if (trend === "up") {
    return "Subiu";
  }

  if (trend === "down") {
    return "Caiu";
  }

  return "Estável";
}

function getTrendPillStyle(trend: Trend) {
  if (trend === "up") {
    return styles.trendWarning;
  }

  if (trend === "down") {
    return styles.trendSuccess;
  }

  return styles.trendNeutral;
}

function getTrendTextStyle(trend: Trend) {
  if (trend === "up") {
    return styles.trendWarningText;
  }

  if (trend === "down") {
    return styles.trendSuccessText;
  }

  return styles.trendNeutralText;
}

function formatValue(value: number, suffix: string) {
  const formatted = Number(value.toFixed(1)).toString();

  if (!suffix) {
    return formatted;
  }

  if (suffix === "°C") {
    return `${formatted}${suffix}`;
  }

  return `${formatted} ${suffix}`;
}

function formatSignedValue(value: number, suffix: string) {
  const signal = value > 0 ? "+" : "";
  return `${signal}${formatValue(value, suffix)}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: {
    flex: 1,
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
    borderRadius: 18,
    alignSelf: "flex-start",
    minWidth: 78,
    alignItems: "center",
  },
  badgeLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  badgeText: {
    marginTop: 2,
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
  },
  trendRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trendPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "900",
  },
  trendWarning: {
    backgroundColor: "#FFFBEB",
  },
  trendWarningText: {
    color: "#B45309",
  },
  trendSuccess: {
    backgroundColor: "#ECFDF5",
  },
  trendSuccessText: {
    color: "#047857",
  },
  trendNeutral: {
    backgroundColor: "#F8FAFC",
  },
  trendNeutralText: {
    color: "#475569",
  },
  trendDescription: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  chartBox: {
    marginTop: 14,
    backgroundColor: "#FFFCF4",
    borderRadius: 22,
    paddingVertical: 4,
    overflow: "hidden",
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  footerCenter: {
    alignItems: "center",
  },
  footerRight: {
    alignItems: "flex-end",
  },
  footerLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  footerText: {
    marginTop: 3,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },
  emptyBox: {
    marginTop: 16,
    backgroundColor: "#FAF8F1",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});