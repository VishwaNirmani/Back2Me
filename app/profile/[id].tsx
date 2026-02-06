import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

const THEME = "#2FB9B0";

export default function PublicProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Failed to load public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={THEME} />
      </SafeAreaView>
    );
  }

  const fullName = userData?.fullName || userData?.displayName || "User";
  const email = userData?.email || "";
  const city = userData?.city || "Location not set";
  const phone = userData?.phone || "";
  const address = userData?.address || "";
  const photoURL = userData?.profileImage || userData?.photoURL || null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: THEME,
            paddingVertical: 18,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            Profile
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* PROFILE CARD */}
        <View
          style={{
            backgroundColor: "#fff",
            margin: 16,
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "#E0F2FE",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              overflow: "hidden",
            }}
          >
            {photoURL ? (
              <Image
                source={{ uri: photoURL }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Ionicons name="person" size={42} color={THEME} />
            )}
          </View>

          <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
            {fullName}
          </Text>

          <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            {city}
          </Text>

          {email ? (
            <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              {email}
            </Text>
          ) : null}

          {phone ? (
            <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              📞 {phone}
            </Text>
          ) : null}

          {address ? (
            <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              📍 {address}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
