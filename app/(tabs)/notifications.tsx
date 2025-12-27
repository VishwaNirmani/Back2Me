import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const THEME = '#2FB9B0';

/* -------------------- DUMMY NEARBY DATA -------------------- */
const NEARBY_ITEMS = [
  {
    id: '1',
    title: 'Brown Leather Wallet',
    status: 'Lost',
    location: 'Kandy City Center',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
  },
  {
    id: '2',
    title: 'iPhone 15 Pro',
    status: 'Found',
    location: 'Kandy Railway Station',
    time: '3 hours ago',
    image: 'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/tile/Apple-iPhone-15-Pro-lineup-hero-230912.jpg.landing-big_2x.jpg',
  },
  {
    id: '3',
    title: 'Black Backpack',
    status: 'Lost',
    location: 'Kandy Library',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  },
  {
    id: '4',
    title: 'Set of Keys',
    status: 'Found',
    location: 'Bus Stand Kandy',
    time: '1 day ago',
    image: 'https://cdn.shopify.com/s/files/1/2245/3557/files/CSE-AS-ExtraKeys.png?v=1713479233',
  },
];

/* -------------------- SCREEN -------------------- */
export default function Notifications() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
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
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: '800',
            }}
          >
            Nearby Items
          </Text>
          <Text
            style={{
              color: '#E6FFFA',
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Check out lost & found items near you
          </Text>
        </View>

        {/* ITEMS LIST */}
        <View style={{ padding: 16 }}>
          {NEARBY_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={{
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                marginBottom: 14,
                overflow: 'hidden',
                elevation: 2,
              }}
            >
              {/* IMAGE */}
              <Image
                source={{ uri: item.image }}
                style={{ width: 80, height: 80 }}
              />

              {/* DETAILS */}
              <View
                style={{
                  flex: 1,
                  padding: 12,
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      color: '#1F2937',
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </Text>

                  {/* Status Badge */}
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor:
                        item.status === 'Lost' ? '#FEE2E2' : '#DCFCE7',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color:
                          item.status === 'Lost' ? '#DC2626' : '#16A34A',
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Location & Time */}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}
                    >
                      {item.location}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {item.time}
                  </Text>
                </View>
              </View>

              {/* ARROW */}
              <View style={{ justifyContent: 'center', paddingRight: 8 }}>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          ))}

          {/* EMPTY STATE */}
          {NEARBY_ITEMS.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
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
                style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}
              >
                No nearby items
              </Text>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>
                Try checking again later
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
