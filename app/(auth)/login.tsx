import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // VALIDATION
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
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

  // LOGIN
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (result.user) {
        setEmail("");
        setPassword("");
        if (Platform.OS === "web") Keyboard.dismiss();
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      console.log("Login Error:", error.code, error.message);

      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "Incorrect email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.header} />

              {/* Title */}
              <Text style={styles.title}>Welcome Back</Text>

              {/* Logo */}
              <View style={styles.logoWrapper}>
                <Image
                  source={require("../../assets/images/logo.jpeg")}
                  style={styles.logo}
                />
                <Text style={styles.logoLabel}>Back2Me</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

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
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === "web") Keyboard.dismiss();
                    router.push("/forgot-password");
                  }}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                {/* Register */}
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === "web") Keyboard.dismiss();
                    router.push("/register");
                  }}
                  disabled={loading}
                >
                  <Text style={styles.footerText}>
                    Do not have an account?{" "}
                    <Text style={styles.boldText}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    height: 90,
    backgroundColor: "#48b1a8",
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 50,
  },
  logoWrapper: {
    alignItems: "center",
    marginVertical: 40,
  },
  logo: {
    width: 180,
    height: 100,
    borderRadius: 10,
  },
  logoLabel: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  form: {
    width: "85%",
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },
  inputError: {
    borderColor: "#ff4444",
    backgroundColor: "#fff5f5",
  },
  button: {
    backgroundColor: "#48b1a8",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotText: {
    textAlign: "center",
    color: "#707070",
    marginTop: 15,
  },
  footerText: {
    textAlign: "center",
    color: "#707070",
    marginTop: 15,
  },
  boldText: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 10,
  },
});
