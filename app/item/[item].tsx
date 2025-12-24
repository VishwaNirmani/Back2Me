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

export default function ItemDetails() {
  const item = {
    title: 'Green Hiking Backpack',
    status: 'Found',
    category: 'Apparel',
    location: 'Kandy',
    date: '1 day ago',
    description:
      'Found a green hiking backpack near Kandy city. It has a front pocket and side bottle holder. No ID inside.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    owner: 'John Doe',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: THEME,
            paddingVertical: 18,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '700',
              marginLeft: 12,
            }}
          >
            Item Details
          </Text>
        </View>

        {/* IMAGE */}
        <Image
          source={{ uri: item.image }}
          style={{
            width: '100%',
            height: 260,
            backgroundColor: '#E5E7EB',
          }}
        />

        {/* CONTENT */}
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: -20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          }}
        >
          {/* TITLE & STATUS */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#111827',
                flex: 1,
              }}
            >
              {item.title}
            </Text>

            <View
              style={{
                backgroundColor:
                  item.status === 'Lost' ? '#FEE2E2' : '#DCFCE7',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 10,
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

          {/* META */}
          <View style={{ marginTop: 10 }}>
            <Text style={metaText}>
              📍 {item.location} • {item.date}
            </Text>
            <Text style={metaText}>Category: {item.category}</Text>
          </View>

          {/* DESCRIPTION */}
          <Text
            style={{
              marginTop: 16,
              fontSize: 14,
              color: '#374151',
              lineHeight: 20,
            }}
          >
            {item.description}
          </Text>

          {/* OWNER */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              backgroundColor: '#F0FDFA',
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name="person-circle" size={40} color={THEME} />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: '600', color: '#111827' }}>
                {item.owner}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                Posted this item
              </Text>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <TouchableOpacity
            style={{
              backgroundColor: THEME,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '700',
              }}
            >
              Contact {item.status === 'Lost' ? 'Finder' : 'Owner'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 10,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text
              style={{
                color: '#374151',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Report Item
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const metaText = {
  fontSize: 13,
  color: '#6B7280',
  marginBottom: 4,
};
