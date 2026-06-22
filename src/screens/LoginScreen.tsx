import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { login } from "../services/authService";
import { colors } from "../theme/colors";

type Props = {
  onLoginSuccess: () => void;
};

export function LoginScreen({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState("gustavo@aruje.com");
  const [password, setPassword] = useState("Aruje123@");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      await login(email.trim(), password);

      onLoginSuccess();
    } catch (error) {
      Alert.alert(
        "Erro ao entrar",
        "Não foi possível realizar login. Verifique a API, e-mail e senha."
      );
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
        <Text style={styles.logo}>Arujé</Text>
        <Text style={styles.subtitle}>Inteligência que cultiva resultados.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.description}>
          Acesse o painel da sua lavoura inteligente.
        </Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.footer}>Tecnologia que transforma o campo.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    fontSize: 54,
    fontWeight: "700",
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    color: colors.muted,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FAF8F1",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 13,
    color: colors.muted,
  },
});