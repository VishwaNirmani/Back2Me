import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db, storage } from "../../../firebaseConfig";

const THEME_COLOR = "#2FB9B0";

type ReportType = "Lost" | "Found";

export default function EditReport() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const reportId = params.id as string | undefined;

  const [type, setType] = useState<ReportType>("Lost");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadReport = async () => {
      if (!reportId) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "reports", reportId));
        if (snap.exists()) {
          const data: any = snap.data();
          setType(data.type || "Lost");
          setItemName(data.itemName || "");
          setDescription(data.description || "");
          setLocation(data.location || "");
          setCategory(data.category || "");
          setImages(Array.isArray(data.images) ? data.images : []);

          if (data.date && typeof data.date.toDate === "function") {
            setDate(data.date.toDate());
          } else if (data.date) {
            setDate(new Date(data.date));
          } else {
            setDate(new Date());
          }
        }
      } catch (error) {
        console.error("Failed to load report:", error);
        Alert.alert("Error", "Failed to load report details.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShowPicker(false);
  };

  const pickImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Gallery access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const takePhotoFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera access is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploadingImage(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `reports/${Date.now()}.jpg`;
      const imageRef = ref(storage, fileName);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      setImages((prev) => [...prev, downloadURL]);
    } catch (error: any) {
      console.error("Image upload failed:", error?.payload || error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSave = async () => {
    if (!reportId) return;
    if (!itemName.trim() || !description.trim() || !location.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "reports", reportId), {
        type,
        itemName: itemName.trim(),
        description: description.trim(),
        location: location.trim(),
        category: category.trim() || null,
        date,
        images,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Success", "Report updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Failed to update report:", error);
      Alert.alert("Error", `Failed to update report: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

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
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View
        style={{
          backgroundColor: THEME_COLOR,
          paddingVertical: 16,
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
          Edit Report
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Toggle Lost / Found */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 6,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: type === "Lost" ? THEME_COLOR : "transparent",
              alignItems: "center",
            }}
            onPress={() => setType("Lost")}
          >
            <Text
              style={{
                color: type === "Lost" ? "#fff" : "#6B7280",
                fontWeight: "700",
              }}
            >
              Lost
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: type === "Found" ? THEME_COLOR : "transparent",
              alignItems: "center",
            }}
            onPress={() => setType("Found")}
          >
            <Text
              style={{
                color: type === "Found" ? "#fff" : "#6B7280",
                fontWeight: "700",
              }}
            >
              Found
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16 }}>
          {/* Item Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>Item Name *</Text>
            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g. Blue Backpack"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>Description *</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe details like color, brand, size..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                minHeight: 110,
              }}
            />
          </View>

          {/* Location */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>Location *</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Central Station, Platform 3"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
          </View>

          {/* Category */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>Category</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Wallets, Keys, Electronics"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
          </View>

          {/* Date */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                padding: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>{date.toDateString()}</Text>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker value={date} mode="date" onChange={handleDateChange} />
          )}

          {/* Images */}
          <View style={{ marginTop: 6, marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>Images</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
              <TouchableOpacity
                onPress={pickImageFromGallery}
                disabled={uploadingImage}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#EFF6FF",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#1D4ED8", fontWeight: "600" }}>
                  Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePhotoFromCamera}
                disabled={uploadingImage}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#ECFDF3",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#047857", fontWeight: "600" }}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>

            {uploadingImage && (
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ color: "#6B7280" }}>Uploading image...</Text>
              </View>
            )}

            {images.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {images.map((img) => (
                  <View key={img} style={{ position: "relative" }}>
                    <Image
                      source={{ uri: img }}
                      style={{ width: 80, height: 80, borderRadius: 10 }}
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(img)}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "#FEE2E2",
                        borderRadius: 12,
                        padding: 4,
                      }}
                    >
                      <Ionicons name="close" size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: "#6B7280" }}>No images</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: THEME_COLOR,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 6,
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
