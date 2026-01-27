import { auth, db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

const THEME = '#2FB9B0';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      return () => {};
    }, [])
  );

  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await auth.signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#F3F4F6',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={THEME} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: THEME,
            paddingVertical: 18,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
            Profile
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View
          style={{
            backgroundColor: '#fff',
            margin: 16,
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: '#E0F2FE',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            {userData?.photoURL || auth.currentUser?.photoURL ? (
              <Image source={{ uri: (userData?.photoURL || auth.currentUser?.photoURL) as string }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Ionicons name="person" size={42} color={THEME} />
            )}
          </View>

          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
            {userData?.fullName || auth.currentUser?.displayName || 'User'}
          </Text>

          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            {userData?.city || 'Location not set'}
          </Text>

          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            {userData?.email || auth.currentUser?.email}
          </Text>

          {userData?.phone ? (
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              📞 {userData.phone}
            </Text>
          ) : null}

          {userData?.address ? (
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              📍 {userData.address}
            </Text>
          ) : null}

          {/* EDIT PROFILE BUTTON */}
          <TouchableOpacity
            onPress={() => router.push('/profile/edit')}
            style={{
              marginTop: 16,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: THEME,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Edit Profile</Text>
          </TouchableOpacity>

          {/* STATS */}
          <View style={{ flexDirection: 'row', marginTop: 20, gap: 12 }}>
            {[
              { label: 'Lost', value: 3 },
              { label: 'Found', value: 2 },
              { label: 'Matches', value: 1 },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  backgroundColor: '#F0FDFA',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: THEME,
                  }}
                >
                  {item.value}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* LOST / FOUND TABS */}
        <View
          style={{
            marginHorizontal: 16,
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 6,
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('lost')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                activeTab === 'lost' ? THEME : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: activeTab === 'lost' ? '#fff' : '#6B7280',
                fontWeight: '700',
              }}
            >
              My Lost Items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('found')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                activeTab === 'found' ? THEME : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: activeTab === 'found' ? '#fff' : '#6B7280',
                fontWeight: '700',
              }}
            >
              My Found Items
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB CONTENT */}
        <View
          style={{
            backgroundColor: '#fff',
            margin: 16,
            borderRadius: 16,
            padding: 16,
          }}
        >
          {activeTab === 'lost' ? (
            <Text style={{ color: '#6B7280' }}>
              🔴 Lost items list will appear here
            </Text>
          ) : (
            <Text style={{ color: '#6B7280' }}>
              🟢 Found items list will appear here
            </Text>
          )}
        </View>

        {/* SETTINGS */}
        <View
          style={{
            backgroundColor: '#fff',
            margin: 16,
            borderRadius: 16,
            paddingVertical: 6,
          }}
        >
          <SettingItem icon="settings-outline" label="Settings" />
          <SettingItem icon="help-circle-outline" label="Help & Support" />
          <SettingItem
            icon="log-out-outline"
            label="Logout"
            danger
            onPress={handleLogout}
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENTS ---------------- */

const SettingItem = ({
  icon,
  label,
  danger,
  onPress,
}: {
  icon: any;
  label: string;
  danger?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    }}
  >
    <Ionicons
      name={icon}
      size={20}
      color={danger ? '#DC2626' : '#6B7280'}
      style={{ width: 24 }}
    />
    <Text
      style={{
        fontSize: 14,
        marginLeft: 12,
        color: danger ? '#DC2626' : '#374151',
        fontWeight: danger ? '600' : '500',
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
