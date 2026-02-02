import { auth, db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
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
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      loadUserReports();
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

  const loadUserReports = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('No user logged in');
        return;
      }

      console.log('Fetching reports for user:', currentUser.uid);

      // Query all user reports - single where clause, no composite index needed
      const reportsQuery = query(
        collection(db, 'reports'),
        where('userId', '==', currentUser.uid)
      );
      
      console.log('Executing query...');
      const reportsSnapshot = await getDocs(reportsQuery);
      console.log('Query successful, got', reportsSnapshot.docs.length, 'reports');
      
      const allReports = reportsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));

      // Filter and sort on client side
      const lost = allReports
        .filter(item => item.type === 'Lost')
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
      
      const found = allReports
        .filter(item => item.type === 'Found')
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });

      setLostItems(lost);
      setFoundItems(found);
    } catch (error: any) {
      console.error('Error loading reports:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      Alert.alert('Error', 'Failed to load your reports. Please try again.');
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

  const handleDeleteReport = async (reportId: string, reportType: 'Lost' | 'Found') => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'reports', reportId));

              if (reportType === 'Lost') {
                setLostItems((prev) => prev.filter((item) => item.id !== reportId));
              } else {
                setFoundItems((prev) => prev.filter((item) => item.id !== reportId));
              }
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', 'Failed to delete the report. Please try again.');
            }
          },
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
              { label: 'Lost', value: lostItems.length },
              { label: 'Found', value: foundItems.length },
              { label: 'Matches', value: 0 },
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
            lostItems.length === 0 ? (
              <Text style={{ color: '#6B7280', textAlign: 'center', paddingVertical: 20 }}>
                🔴 No lost items reported yet
              </Text>
            ) : (
              <View style={{ gap: 12 }}>
                {lostItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={() => handleDeleteReport(item.id, 'Lost')}
                  />
                ))}
              </View>
            )
          ) : (
            foundItems.length === 0 ? (
              <Text style={{ color: '#6B7280', textAlign: 'center', paddingVertical: 20 }}>
                🟢 No found items reported yet
              </Text>
            ) : (
              <View style={{ gap: 12 }}>
                {foundItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={() => handleDeleteReport(item.id, 'Found')}
                  />
                ))}
              </View>
            )
          )}
        </View>

        {/* LOGOUT */}
        <View
          style={{
            backgroundColor: '#fff',
            margin: 16,
            borderRadius: 16,
            paddingVertical: 6,
          }}
        >
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

const ItemCard = ({ item, onDelete }: { item: any; onDelete: () => void }) => {
  const itemDate = item.date?.toDate ? item.date.toDate() : new Date(item.date);
  
  return (
    <View
      style={{
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
            {item.itemName}
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              {itemDate.toLocaleDateString()}
            </Text>
          </View>
          {item.category && (
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 11, color: THEME, backgroundColor: '#F0FDFA', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' }}>
                {item.category}
              </Text>
            </View>
          )}
        </View>
        <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
          <TouchableOpacity
            onPress={onDelete}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: '#FEE2E2',
              marginBottom: 8,
            }}
          >
            <Text style={{ color: '#DC2626', fontSize: 12, fontWeight: '600' }}>
              Delete
            </Text>
          </TouchableOpacity>
          {item.images && item.images.length > 0 && (
            <Image
              source={{ uri: item.images[0] }}
              style={{ width: 70, height: 70, borderRadius: 8 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
