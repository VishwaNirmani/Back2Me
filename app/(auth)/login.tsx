import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        setEmail("");
        setPassword("");
        setLoading(false);
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during login"
      );
      setLoading(false);
    }
  };

  const handleSignupPress = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}></View>
        <Text style={styles.title}>Welcome Back</Text>

        {/* Brand Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/images/logo.jpeg")}
            style={styles.logo}
          />
        </View>

        <View style={styles.form}>
          {/* Email Field */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          {/* Password Field */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Enter your password"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            secureTextEntry
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <TouchableOpacity onPress={handleSignupPress} disabled={loading}>
            <Text style={styles.footerText}>
              Do not have an account? <Text style={styles.boldText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  header: {
    height: 90,
    backgroundColor: "#48b1a8",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 50,
  },
  logoWrapper: { alignItems: "center", marginVertical: 40 },
  logo: { width: 180, height: 100, borderRadius: 10 },
  form: { width: "85%", alignSelf: "center" },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 5 },
  input: {
    backgroundColor: "white",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    backgroundColor: "#48b1a8",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  forgotText: { textAlign: "center", color: "#707070", marginTop: 15 },
  footerText: { textAlign: "center", color: "#707070", marginTop: 15 },
  boldText: { color: "#1A1A1A", fontWeight: "600" },
  errorText: { color: "#ff4444", fontSize: 12, marginTop: 5 },
  inputError: { borderColor: "#ff4444", backgroundColor: "#fff5f5" },
});
