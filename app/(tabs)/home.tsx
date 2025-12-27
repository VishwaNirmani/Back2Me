import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const THEME = '#2FB9B0';

const CATEGORIES = ['All', 'Electronics', 'Wallets', 'Documents', 'Keys'];

const ITEMS = [
  {
    id: '1',
    title: 'Brown Leather Wallet',
    status: 'Lost',
    location: 'Colombo',
    time: '2h ago',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
  },
  {
    id: '2',
    title: 'Found Keys',
    status: 'Found',
    location: 'Kandy',
    time: '1h ago',
    image:
      'https://cdn.shopify.com/s/files/1/2245/3557/files/CSE-AS-ExtraKeys.png?v=1713479233',
  },
  {
    id: '3',
    title: 'Lost Backpack',
    status: 'Lost',
    location: 'Peradeniya',
    time: '1d ago',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
  },
];

export default function Home() {
  const [tab, setTab] = useState<'Lost' | 'Found'>('Lost');
  const [category, setCategory] = useState('All');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: THEME,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: '700',
            }}
          >
            Back2Me
          </Text>

          <Text
            style={{
              color: '#ECFEFF',
              fontSize: 13,
              marginTop: 2,
            }}
          >
            Reuniting you with what matters most
          </Text>

          {/* SEARCH */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 10,
              marginTop: 14,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search keys, phone, wallet..."
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
                backgroundColor:
                  category === item ? THEME : '#E5E7EB',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: category === item ? '#fff' : '#6B7280',
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
            flexDirection: 'row',
            marginHorizontal: 16,
            backgroundColor: '#E5E7EB',
            borderRadius: 10,
            padding: 4,
            marginBottom: 10,
          }}
        >
          {['Lost', 'Found'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTab(item as any)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: tab === item ? '#fff' : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  color: tab === item ? THEME : '#6B7280',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FEED */}
        {ITEMS.filter((i) => i.status === tab).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              backgroundColor: '#fff',
              marginHorizontal: 16,
              marginBottom: 12,
              borderRadius: 14,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                backgroundColor: '#E5E7EB',
              }}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: '#6B7280',
                  marginTop: 4,
                }}
              >
                {item.location} • {item.time}
              </Text>
            </View>

            <View
              style={{
                backgroundColor:
                  item.status === 'Lost' ? '#FEE2E2' : '#DCFCE7',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    item.status === 'Lost' ? '#DC2626' : '#16A34A',
                }}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
