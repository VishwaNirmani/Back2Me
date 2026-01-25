import { auth, db, storage } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const THEME = '#2FB9B0';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      if (!user) {
        setError('Not signed in.');
        setLoading(false);
        return;
      }
      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.exists() ? (snap.data() as any) : {};
      setFullName(data?.fullName || user.displayName || '');
      setEmail(user.email || '');
      setPhone(data?.phone || '');
      setCity(data?.city || '');
      setAddress(data?.address || '');
      setPhotoURL(data?.photoURL || user.photoURL || null);
    } catch (e: any) {
      console.error('EditProfile load error', e);
      // If offline, fall back to Auth data without showing error
      const user = auth.currentUser;
      if (user) {
        setFullName(user.displayName || '');
        setEmail(user.email || '');
      }
      const isOffline = e?.code === 'unavailable' || String(e?.message || '').toLowerCase().includes('offline');
      if (!isOffline) {
        setError(`Failed to load profile: ${e?.message || 'Unknown error'}`);
      } else {
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pickImage = async () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera access is required.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
              setLocalUri(result.assets[0].uri);
            }
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Gallery access is required.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
              setLocalUri(result.assets[0].uri);
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Not signed in.');
        return;
      }
      if (!fullName.trim()) {
        setError('Full name is required.');
        return;
      }
      if (phone.trim() && !/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
        setError('Phone must contain at least 10 digits.');
        return;
      }

      setSaving(true);
      let newPhotoURL = photoURL;

      // Upload new image if selected
      if (localUri) {
        try {
          const response = await fetch(localUri);
          const blob = await response.blob();

          // Create a reference to 'users/<uid>/profile.jpg'
          const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

          // Upload with metadata
          await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });

          // Get the download URL
          newPhotoURL = await getDownloadURL(storageRef);
        } catch (uploadError: any) {
          console.error("Upload failed", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // Update Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
          email: user.email,
          profileImage: newPhotoURL || null, // USING profileImage FIELD AS REQUESTED
          photoURL: newPhotoURL || null, // Keep photoURL for backward compatibility if needed, else remove
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Update Auth Profile
      await updateProfile(user, {
        displayName: fullName.trim(),
        photoURL: newPhotoURL || undefined,
      });

      setSuccess('Profile updated');
      setTimeout(() => router.back(), 1000); // Wait a bit so user sees success message
    } catch (e: any) {
      console.error('Save profile error', e);
      setError(`Failed to save: ${e?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={THEME} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <View style={{ backgroundColor: THEME, paddingVertical: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          {/* Avatar */}
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }}>
              {localUri || photoURL ? (
                <Image source={{ uri: localUri || (photoURL as string) }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Ionicons name="person" size={44} color={THEME} />
              )}
            </View>
            <TouchableOpacity onPress={pickImage} style={{ marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F3F4F6' }}>
              <Text style={{ color: '#374151', fontWeight: '600' }}>Change Profile Picture</Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <Text style={{ fontSize: 12, color: '#6B7280' }}>Full Name</Text>
          <TextInput value={fullName} onChangeText={setFullName} placeholder="Enter your full name" style={{ marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }} />

          {/* Email (read-only) */}
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 14 }}>Email Address</Text>
          <TextInput value={email} editable={false} selectTextOnFocus={false} style={{ marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }} />

          {/* Phone */}
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 14 }}>Phone Number</Text>
          <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Enter your phone number" style={{ marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }} />

          {/* City */}
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 14 }}>City</Text>
          <TextInput value={city} onChangeText={setCity} placeholder="Enter your city" style={{ marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }} />

          {/* Address */}
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 14 }}>Address</Text>
          <TextInput value={address} onChangeText={setAddress} placeholder="Enter your address" multiline style={{ marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, minHeight: 80, textAlignVertical: 'top' }} />

          {error ? (
            <View style={{ marginTop: 12, backgroundColor: '#FEE2E2', borderRadius: 10, padding: 10 }}>
              <Text style={{ color: '#DC2626' }}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={{ marginTop: 12, backgroundColor: '#D1FAE5', borderRadius: 10, padding: 10 }}>
              <Text style={{ color: '#065F46' }}>{success}</Text>
            </View>
          ) : null}

          {/* Save */}
          <TouchableOpacity disabled={saving} onPress={handleSave} style={{ marginTop: 16, paddingVertical: 12, borderRadius: 10, backgroundColor: THEME, alignItems: 'center', opacity: saving ? 0.8 : 1 }}>
            {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
