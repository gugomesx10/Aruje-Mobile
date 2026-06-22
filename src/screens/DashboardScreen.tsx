import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Arujé</Text>
      <Text style={styles.subtitle}>Login realizado com sucesso.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>API conectada</Text>
        <Text style={styles.cardText}>
          Agora vamos puxar sensores, leituras, alertas e análises IA.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.muted,
  },
  card: {
    marginTop: 28,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
});