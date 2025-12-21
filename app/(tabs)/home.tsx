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

/* -------------------- DUMMY DATA -------------------- */

const LOST_ITEMS = [
  {
    id: '1',
    title: 'Brown Leather Wallet',
    status: 'Lost',
    location: 'Kandy • 16 Apparel',
    timePosted: '10,102, 10 ago, 2011',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Wallets',
  },
  {
    id: '2',
    title: 'Lost Backpack',
    status: 'Lost',
    location: 'Kandy • 18 Apparel',
    timePosted: '10,105, 10 ago, 2017',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Apparel',
  },
];

const FOUND_ITEMS = [
  {
    id: '3',
    title: 'Found iPhone',
    status: 'Found',
    location: 'Colombo • Bus Stand',
    timePosted: '2 hours ago',
    image: 'https://lifemobile.lk/product/apple-iphone-16-128gb/',
    category: 'Electronics',
  },
  {
    id: '4',
    title: 'Found Keys',
    status: 'Found',
    location: 'Kandy • City Center',
    timePosted: '1 day ago',
    image: 'https://images.unsplash.com/photo-1589994965851-a8ed025e4d6f?w=400',
    category: 'Keys',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Documents', 'Keys', 'Apparel'];

/* -------------------- SCREEN -------------------- */

export default function Home() {
  const [activeTab, setActiveTab] = useState<'Lost' | 'Found'>('Lost');
  const [category, setCategory] = useState('All');

  const currentData = activeTab === 'Lost' ? LOST_ITEMS : FOUND_ITEMS;

  const filteredItems = currentData.filter(
    (item) => category === 'All' || item.category === category
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
<View
  style={{
    backgroundColor: '#2FB9B0',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  }}
>
  <Text
    style={{
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '800',
      marginTop: 30,
    }}
  >
    Back2Me
  </Text>

  <Text
    style={{
      color: '#E6FFFA',
      fontSize: 15,
      fontWeight: '500',
      marginBottom: 12,
    }}
  >
    Helping you reunite with what matters most
  </Text>

  
</View>

        {/* SEARCH BAR */}
        <View
          style={{
            top: 10,
            marginHorizontal: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 12,
            elevation: 4,
          }}
        >
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search for keys, phone, wallet, etc."
            style={{ marginLeft: 10, flex: 1 }}
          />
        </View>

        {/* CATEGORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                backgroundColor: category === cat ? '#2FB9B0' : '#FFFFFF',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: category === cat ? '#FFFFFF' : '#6B7280',
                  fontWeight: '600',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LOST / FOUND TOGGLE */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 20 }}>
          {['Lost', 'Found'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as 'Lost' | 'Found')}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: activeTab === tab ? '#2FB9B0' : '#9CA3AF',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ITEMS LIST */}
        <View style={{ padding: 16 }}>
          {filteredItems.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                padding: 12,
                flexDirection: 'row',
                marginBottom: 14,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: 60, height: 60, borderRadius: 10 }}
              />

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>
                  {item.title}
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 13 }}>
                  {item.location}
                </Text>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                  {item.timePosted}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  backgroundColor:
                    item.status === 'Lost' ? '#EF4444' : '#22C55E',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
