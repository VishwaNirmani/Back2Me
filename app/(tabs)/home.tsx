import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import useRouter
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList, // Import FlatList
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

const THEME = "#2FB9B0";

const CATEGORIES = ["All", "Electronics", "Wallets", "Documents", "Keys"];

// Placeholder image shown when report has no image
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300?text=No+Image";

export default function Home() {
  const router = useRouter(); // Initialize router
  const [tab, setTab] = useState<"Lost" | "Found">("Lost");
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // Add search state
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  // Helper: human readable time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Subscribe to `reports` collection in Firestore
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const mapped = snapshot.docs.map((doc) => {
          const data: any = doc.data();
          let createdAt: Date = new Date();
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            createdAt = data.createdAt.toDate();
          } else if (data.date && typeof data.date.toDate === "function") {
            createdAt = data.date.toDate();
          } else if (data.date) {
            createdAt = new Date(data.date);
          }

          return {
            id: doc.id,
            title: data.itemName || "Untitled",
            status: data.type || "Lost",
            location: data.location || "",
            time: timeAgo(createdAt),
            image: (data.images && data.images[0]) || PLACEHOLDER_IMAGE,
            description: data.description || "",
            owner: data.owner || "",
            category: data.category || "",
          };
        });

        setItems(mapped);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe to reports:", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const filteredItems = items.filter((i) => {
    const matchesTab = i.status === tab;
    const matchesCategory =
      category === "All" || !i.category || i.category === category;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      // match item name / title
      (i.title && i.title.toLowerCase().includes(q)) ||
      // match location
      (i.location && i.location.toLowerCase().includes(q)) ||
      // match description
      (i.description && i.description.toLowerCase().includes(q)) ||
      // match owner/name
      (i.owner && i.owner.toLowerCase().includes(q));

    return matchesTab && matchesCategory && matchesSearch;
  });

  // Render Item Component for FlatList
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        // Navigate to item details, passing params
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
            category: item.category,
          },
        });
      }}
    >
      <Image
        source={{ uri: item.image || PLACEHOLDER_IMAGE }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 10,
          backgroundColor: "#E5E7EB",
        }}
      />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#111827",
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginTop: 4,
          }}
        >
          {item.location} • {item.time}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: item.status === "Lost" ? "#FEE2E2" : "#DCFCE7",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: item.status === "Lost" ? "#DC2626" : "#16A34A",
          }}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      {/* 
        Using FlatList for the feed part, but since we have a complex header (Categories, Tabs, Search),
        we should use ListHeaderComponent to render them so everything scrolls together.
      */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View
              style={{
                backgroundColor: THEME,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                Back2Me
              </Text>

              <Text
                style={{
                  color: "#ECFEFF",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Reuniting you with what matters most
              </Text>

              {/* SEARCH */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  marginTop: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                  placeholder="Search keys, phone, wallet..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 14,
                  }}
                />
              </View>
            </View>

            {/* CATEGORY CHIPS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 10,
              }}
            >
              {CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setCategory(item)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: category === item ? THEME : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: category === item ? "#fff" : "#6B7280",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* LOST / FOUND TABS */}
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 16,
                backgroundColor: "#E5E7EB",
                borderRadius: 10,
                padding: 4,
                marginBottom: 10,
              }}
            >
              {["Lost", "Found"].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setTab(item as any)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: tab === item ? "#fff" : "transparent",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: tab === item ? THEME : "#6B7280",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </SafeAreaView>
  );
}
