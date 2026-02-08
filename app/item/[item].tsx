import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const THEME = "#2FB9B0";

export default function ItemDetails() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const item = {
    title: "Green Hiking Backpack",
    status: "Found",
    category: "Apparel",
    location: "Kandy",
    date: "1 day ago",
    description:
      "Found a green hiking backpack near Kandy city. It has a front pocket and side bottle holder. No ID inside.",
    image:
      "https://www.driftersshop.co.za/cdn/shop/files/FirstAscentMercury65LLightweightTrekkingPack_2000x.webp?v=1726487430https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVrSwVInV0UzlVTIoziEUQjASm852v67PqiA&s",
    owner: "John Doe",
  };

  const reportReasons = [
    { icon: "warning-outline" as any, text: "Spam or Scam" },
    { icon: "alert-circle-outline" as any, text: "Inappropriate Content" },
    { icon: "close-circle-outline" as any, text: "Fake/Fraudulent Item" },
    { icon: "copy-outline" as any, text: "Duplicate Listing" },
    { icon: "checkmark-circle-outline" as any, text: "Already Found/Claimed" },
    { icon: "ellipsis-horizontal-outline" as any, text: "Other Issue" },
  ];

  const handleReport = () => {
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!selectedReason) {
      alert("Please select a reason");
      return;
    }
    alert(`Report submitted: ${selectedReason}`);
    setShowReportModal(false);
    setSelectedReason("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* IMAGE SECTION */}
        <View style={styles.imageSection}>
          <Image source={{ uri: item.image }} style={styles.mainImage} />
        </View>

        {/* CONTENT CARD */}
        <View style={styles.contentCard}>
          {/* TITLE */}
          <Text style={styles.title}>{item.title}</Text>

          {/* STATUS BADGE */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadgeLarge,
                {
                  backgroundColor:
                    item.status === "Lost" ? "#FEE2E2" : "#DCFCE7",
                },
              ]}
            >
              <Ionicons
                name={
                  item.status === "Lost"
                    ? "sad-outline"
                    : "checkmark-circle-outline"
                }
                size={20}
                color={item.status === "Lost" ? "#DC2626" : "#16A34A"}
              />
              <Text
                style={[
                  styles.statusTextLarge,
                  { color: item.status === "Lost" ? "#DC2626" : "#16A34A" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          {/* INFO CARDS */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={20} color={THEME} />
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{item.location}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={20} color={THEME} />
              <Text style={styles.infoLabel}>Posted</Text>
              <Text style={styles.infoValue}>{item.date}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="grid-outline" size={20} color={THEME} />
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{item.category}</Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color="#111827" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* OWNER INFO */}
          <View style={styles.ownerCard}>
            <View style={styles.ownerLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.owner.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.ownerName}>{item.owner}</Text>
                <Text style={styles.ownerSubtext}>Posted this item</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble" size={18} color={THEME} />
            </TouchableOpacity>
          </View>

          {/* ACTION BUTTONS */}
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="person-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReport}
          >
            <Ionicons name="flag" size={18} color="#EF4444" />
            <Text style={styles.secondaryButtonText}>Report Item</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* REPORT MODAL */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Item</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <Ionicons name="close" size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Please select a reason for reporting this item
            </Text>

            <ScrollView style={styles.reasonsList}>
              {reportReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason.text && styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason.text)}
                >
                  <Ionicons
                    name={reason.icon}
                    size={22}
                    color={selectedReason === reason.text ? THEME : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason.text &&
                        styles.reasonTextSelected,
                    ]}
                  >
                    {reason.text}
                  </Text>
                  {selectedReason === reason.text && (
                    <Ionicons name="checkmark-circle" size={22} color={THEME} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitReport}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: THEME,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  imageSection: {
    position: "relative",
    backgroundColor: THEME,
    paddingBottom: 0,
  },
  mainImage: {
    width: "100%",
    height: 280,
    alignSelf: "center",
  },
  imageOverlay: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusBadgeLarge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusTextLarge: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  contactButton: {
    borderWidth: 2,
    borderColor: THEME,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME,
  },
  contentCard: {
    backgroundColor: "#fff",
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "700",
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  ownerCard: {
    backgroundColor: "#F0FDFA",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  ownerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  ownerSubtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  primaryButton: {
    backgroundColor: THEME,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    elevation: 3,
    shadowColor: THEME,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  reasonsList: {
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
    gap: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reasonItemSelected: {
    backgroundColor: "#F0FDFA",
    borderColor: THEME,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  reasonTextSelected: {
    color: "#111827",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
