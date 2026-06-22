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

import { Sensor } from "../services/dashboardService";
import { colors } from "../theme/colors";

type SensorDetailsRouteParams = {
  SensorDetails: {
    sensor: Sensor;
  };
};

export function SensorDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<SensorDetailsRouteParams, "SensorDetails">>();

  const { sensor } = route.params;

  const sensorType = getSensorType(sensor);
  const sensorInfo = getSensorInfo(sensorType);
  const isActive = sensor.isActive !== false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Sensor IoT</Text>
            <Text style={styles.title}>{sensor.name ?? "Sensor sem nome"}</Text>
            <Text style={styles.subtitle}>
              Detalhes do dispositivo cadastrado para monitoramento agrícola.
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name={sensorInfo.icon}
              size={30}
              color={sensorInfo.color}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>Tipo do sensor</Text>
            <Text style={styles.heroTitle}>{sensorInfo.label}</Text>
            <Text style={styles.heroDescription}>
              {sensor.description ??
                "Sensor preparado para receber dados da simulação IoT."}
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <MetricCard
            icon={
              <Ionicons
                name={isActive ? "checkmark-circle-outline" : "close-circle-outline"}
                size={22}
                color={isActive ? colors.success : colors.danger}
              />
            }
            label="Status"
            value={isActive ? "Online" : "Inativo"}
          />

          <MetricCard
            icon={
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.primary}
              />
            }
            label="Criado em"
            value={formatDate(sensor.createdAt)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações técnicas</Text>

          <InfoRow label="ID" value={sensor.id} />
          <InfoRow label="Nome" value={sensor.name ?? "Sensor sem nome"} />
          <InfoRow label="Tipo" value={sensorInfo.label} />
          <InfoRow label="Status" value={isActive ? "Online" : "Inativo"} />
          <InfoRow label="Criado em" value={formatDate(sensor.createdAt)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descrição</Text>
          <Text style={styles.description}>
            {sensor.description ??
              "Este sensor está cadastrado na plataforma Arujé e pode ser usado para compor as leituras agrícolas exibidas no painel."}
          </Text>
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

function getSensorType(sensor: Sensor) {
  return sensor.sensorType ?? sensor.type ?? "Unknown";
}

function getSensorInfo(value: string | number): {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
} {
  if (value === 1 || value === "1" || value === "Temperature") {
    return {
      label: "Temperatura",
      icon: "thermometer",
      color: colors.primary,
    };
  }

  if (value === 2 || value === "2" || value === "Humidity") {
    return {
      label: "Umidade do ar",
      icon: "water-percent",
      color: colors.primary,
    };
  }

  if (value === 3 || value === "3" || value === "SoilMoisture") {
    return {
      label: "Umidade do solo",
      icon: "sprout",
      color: colors.primary,
    };
  }

  if (value === 4 || value === "4" || value === "Luminosity") {
    return {
      label: "Luminosidade",
      icon: "white-balance-sunny",
      color: colors.warning,
    };
  }

  if (value === 5 || value === "5" || value === "Motion") {
    return {
      label: "Movimento",
      icon: "motion-sensor",
      color: colors.primary,
    };
  }

  return {
    label: String(value),
    icon: "access-point-network",
    color: colors.primary,
  };
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
    fontSize: 28,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    marginBottom: 14,
    flexDirection: "row",
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  heroTitle: {
    marginTop: 4,
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: "900",
  },
  heroDescription: {
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
    fontSize: 16,
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
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
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
});