import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

const THEME = "#2FB9B0";

const NEARBY_RADIUS_KM = 10;

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400?text=No+Image";

export default function Notifications() {
  const router = useRouter();
  const [nearbyItems, setNearbyItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const prevIdsRef = useRef<Set<string>>(new Set());

  const distanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    let unsub: any;
    let userLoc: { lat: number; lng: number } | null = null;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationDenied(true);
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };

        const q = query(
          collection(db, "reports"),
          orderBy("createdAt", "desc"),
        );
        unsub = onSnapshot(
          q,
          async (snapshot) => {
            const nearby: any[] = [];

            for (const doc of snapshot.docs) {
              const data: any = doc.data();

              let coords: { lat: number; lng: number } | null = null;
              if (
                data.coords &&
                data.coords.lat != null &&
                data.coords.lng != null
              ) {
                coords = { lat: data.coords.lat, lng: data.coords.lng };
              } else if (data.geoPoint && data.geoPoint.latitude != null) {
                coords = {
                  lat: data.geoPoint.latitude,
                  lng: data.geoPoint.longitude,
                };
              } else if (data.latitude != null && data.longitude != null) {
                coords = { lat: data.latitude, lng: data.longitude };
              } else if (
                data.locationCoords &&
                data.locationCoords.latitude != null
              ) {
                coords = {
                  lat: data.locationCoords.latitude,
                  lng: data.locationCoords.longitude,
                };
              }

              if (!coords && data.location) {
                try {
                  const geocoded = await Location.geocodeAsync(data.location);
                  if (geocoded && geocoded.length > 0) {
                    coords = {
                      lat: geocoded[0].latitude,
                      lng: geocoded[0].longitude,
                    };
                  }
                } catch (e) {}
              }

              if (!coords || !userLoc) continue;

              const d = distanceKm(
                userLoc.lat,
                userLoc.lng,
                coords.lat,
                coords.lng,
              );
              if (d <= NEARBY_RADIUS_KM) {
                const createdAt =
                  data.createdAt && typeof data.createdAt.toDate === "function"
                    ? data.createdAt.toDate()
                    : data.date && typeof data.date.toDate === "function"
                      ? data.date.toDate()
                      : data.date
                        ? new Date(data.date)
                        : new Date();

                nearby.push({
                  id: doc.id,
                  title: data.itemName || "Untitled",
                  status: data.type || "Lost",
                  location: data.location || "",
                  time: (() => {
                    const seconds = Math.floor(
                      (Date.now() - createdAt.getTime()) / 1000,
                    );
                    if (seconds < 60) return `${seconds}s ago`;
                    const minutes = Math.floor(seconds / 60);
                    if (minutes < 60) return `${minutes}m ago`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `${hours}h ago`;
                    const days = Math.floor(hours / 24);
                    return `${days}d ago`;
                  })(),
                  image: (data.images && data.images[0]) || PLACEHOLDER_IMAGE,
                  description: data.description || "",
                  owner: data.ownerName || data.owner || "Anonymous",
                  ownerId: data.userId || "",
                  category: data.category || "",
                  distanceKm: Math.round(d * 10) / 10,
                });
              }
            }

            const newIds = new Set(nearby.map((n) => n.id));
            const prev = prevIdsRef.current;
            for (const id of newIds) {
              if (!prev.has(id)) {
                const ni = nearby.find((x) => x.id === id);
                if (ni) {
                  Alert.alert(
                    "Nearby item",
                    `${ni.title} reported at ${ni.location} is nearby (${ni.distanceKm} km)`,
                  );
                }
              }
            }
            prevIdsRef.current = newIds;

            setNearbyItems(nearby);
            setLoading(false);
          },
          (err) => {
            console.error("snapshot error", err);
            setLoading(false);
          },
        );
      } catch (err) {
        console.error("location / subscription error", err);
        setLoading(false);
      }
    };

    start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: THEME,
            paddingTop: 24,
            paddingBottom: 24,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            Nearby Items
          </Text>
          <Text
            style={{
              color: "#E6FFFA",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Items within {NEARBY_RADIUS_KM} km of your location
          </Text>
        </View>

        <View style={{ padding: 16 }}>
          {loading && (
            <View style={{ padding: 20 }}>
              <ActivityIndicator color={THEME} />
            </View>
          )}

          {!loading && locationDenied && (
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#6B7280" }}>
                Location permission denied. Enable location to see nearby items.
              </Text>
            </View>
          )}

          {!loading &&
            nearbyItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/item/[id]",
                    params: {
                      id: item.id,
                      title: item.title,
                      status: item.status,
                      location: item.location,
                      time: item.time,
                      image: item.image,
                      description: item.description,
                      owner: item.owner,
                      ownerId: item.ownerId,
                      category: item.category,
                    },
                  })
                }
                style={{
                  flexDirection: "row",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  marginBottom: 14,
                  overflow: "hidden",
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 80, height: 80 }}
                />
                <View
                  style={{
                    flex: 1,
                    padding: 12,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "#1F2937",
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor:
                          item.status === "Lost" ? "#FEE2E2" : "#DCFCE7",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: item.status === "Lost" ? "#DC2626" : "#16A34A",
                        }}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#6B7280"
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginLeft: 4,
                        }}
                      >
                        {item.location} • {item.distanceKm} km
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {item.time}
                    </Text>
                  </View>
                </View>
                <View style={{ justifyContent: "center", paddingRight: 8 }}>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            ))}

          {!loading && !locationDenied && nearbyItems.length === 0 && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 60,
              }}
            >
              <Ionicons
                name="search"
                size={48}
                color="#D1D5DB"
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#6B7280" }}
              >
                No nearby items
              </Text>
              <Text style={{ fontSize: 14, color: "#9CA3AF" }}>
                No reports found within {NEARBY_RADIUS_KM} km
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
