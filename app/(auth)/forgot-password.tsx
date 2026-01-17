import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        Keyboard.dismiss(); // Close keyboard

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                "Check your email",
                "A password reset link has been sent to your email address.",
                [{
                    text: "OK", onPress: () => router.replace("/login")
                }]
            );
        } catch (error: any) {
            let errorMessage = "An error occurred. Please try again.";
            if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email format.";
            }
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isEmailValid = email && /\S+@\S+\.\S+/.test(email);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reset Password</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.description}>
                        Enter the email address associated with your account and we'll send you a link to reset your password.
                    </Text>

                    {/* Email Field */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            editable={!loading}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {!isEmailValid && email.length > 0 && (
                            <Text style={styles.errorText}>Please enter a valid email</Text>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                (!isEmailValid || loading) && { opacity: 0.6 }
                            ]}
                            onPress={handleResetPassword}
                            disabled={!isEmailValid || loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FB" },
    header: {
        height: 60,
        backgroundColor: "#48b1a8",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 15,
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 40,
    },
    description: {
        fontSize: 15,
        color: "#555",
        lineHeight: 22,
        marginBottom: 30,
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
    input: {
        backgroundColor: "white",
        height: 55,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 5,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#48b1a8",
        height: 55,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#48b1a8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
});
