import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { MapPin, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: fullName.trim(),
      });

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
        profileImage: null,
        bio: '',
      });

      // Sign out
      await auth.signOut();

      // Clear form
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setLoading(false); // Stop loading immediately after success

      // Show success message then navigate
      Alert.alert('Successfully Registered!', 'Redirecting to login...');
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error: any) {
      setLoading(false);

      // Handle specific Firebase errors
      let errorMessage = 'Something went wrong';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password authentication is not enabled. Contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A0A0A0"
            value={fullName}
            onChangeText={setFullName}
            editable={!loading}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#A0A0A0"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            secureTextEntry
          />

          <View style={styles.inputWithIcon}>
            <TextInput
              style={{ flex: 1, fontSize: 16 }}
              placeholder="City (Autocomplete)"
              placeholderTextColor="#A0A0A0"
            />
            <MapPin size={20} color="#48b1a8" />
          </View>

          <View style={styles.permissionRow}>
            <ShieldCheck size={22} color="#48b1a8" />
            <Text style={styles.permissionText}>Allow location permission</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#48b1a8" }}
              thumbColor={"#F4F4F4"}
              value={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} disabled={loading}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.boldText}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  header: {
    height: 90,
    marginBottom: 40,
    backgroundColor: "#48b1a8",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 28, fontWeight: "600" },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 30 },
  form: { width: "100%" },
  input: {
    backgroundColor: "white",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  permissionText: { flex: 1, marginLeft: 10, color: "#606060", fontSize: 15 },
  button: {
    backgroundColor: "#48b1a8",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  footerText: { textAlign: "center", color: "#707070", marginTop: 25 },
  boldText: { color: "#1A1A1A", fontWeight: "600" },
  buttonDisabled: { opacity: 0.6 },
});