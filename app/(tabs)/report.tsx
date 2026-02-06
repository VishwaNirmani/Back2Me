import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db, storage } from "../../firebaseConfig"; // Import auth from config

const THEME_COLOR = "#2FB9B0";

type ReportType = "Lost" | "Found";

export default function ReportScreen() {
  const [type, setType] = useState<ReportType>("Lost");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate); // update date
    setShowPicker(false); // close picker after select
  };

  const resetForm = () => {
    setType("Lost");
    setItemName("");
    setDescription("");
    setLocation("");
    setCategory("");
    setDate(new Date());
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

      const res = await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      setImages((prev) => [...prev, downloadURL]);
    } catch (error: any) {
      console.error("Image upload failed:", error.payload || error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const submitReport = async () => {
    if (!itemName.trim() || !description.trim() || !location.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in to submit a report.");
        setLoading(false);
        return;
      }

      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userSnap.exists() ? userSnap.data() : null;
      const ownerName =
        userData?.fullName ||
        currentUser.displayName ||
        currentUser.email ||
        "Anonymous";

      await addDoc(collection(db, "reports"), {
        type,
        itemName: itemName.trim(),
        description: description.trim(),
        location: location.trim(),
        category: category.trim() || null,
        date,
        images,
        userId: currentUser.uid,
        ownerName,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Your report has been submitted successfully!", [
        { text: "OK", onPress: resetForm },
      ]);
    } catch (error: any) {
      console.error("Error submitting report:", error);
      Alert.alert("Error", `Failed to submit report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Report</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {/* Toggle Lost / Found */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                type === "Lost" && styles.activeToggle,
              ]}
              onPress={() => setType("Lost")}
            >
              <Text
                style={[
                  styles.toggleText,
                  type === "Lost" && styles.activeToggleText,
                ]}
              >
                Lost
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                type === "Found" && styles.activeToggle,
              ]}
              onPress={() => setType("Found")}
            >
              <Text
                style={[
                  styles.toggleText,
                  type === "Found" && styles.activeToggleText,
                ]}
              >
                Found
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Item Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Item Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Blue Backpack"
                value={itemName}
                onChangeText={setItemName}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe details like color, brand, size..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Central Station, Platform 3"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Wallets, Keys, Electronics"
                value={category}
                onChangeText={setCategory}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Date Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.dateText}>{date.toDateString()}</Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </TouchableOpacity>

              {showPicker && (
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()} // only past dates
                    onChange={handleDateChange}
                  />
                </View>
              )}
            </View>

            {/* Add Photos (UI Only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Add Photos</Text>
              <View style={styles.photoContainer}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={takePhotoFromCamera}
                >
                  <Ionicons name="camera" size={24} color={THEME_COLOR} />
                  <Text style={styles.photoButtonText}>
                    {uploadingImage ? "Uploading...." : "Camera"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={pickImageFromGallery}
                >
                  <Ionicons name="image" size={24} color={THEME_COLOR} />
                  <Text style={styles.photoButtonText}>
                    {uploadingImage ? "Uploading...." : "Gallery"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={submitReport}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  scrollContent: { paddingBottom: 40 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeToggle: { backgroundColor: "#fff" },
  toggleText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  activeToggleText: { color: THEME_COLOR },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  required: { color: "#EF4444" },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  textArea: { height: 100 },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: { fontSize: 16, color: "#1F2937" },
  photoContainer: { flexDirection: "row", gap: 12 },
  photoButton: {
    flex: 1,
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#CCFBF1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoButtonText: { fontSize: 12, color: THEME_COLOR, fontWeight: "500" },
  submitButton: {
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
});
