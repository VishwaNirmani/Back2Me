import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const THEME = '#2FB9B0';

export default function Report() {
  const [type, setType] = useState<'Lost' | 'Found'>('Lost');

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
          
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '700',
              marginLeft: 12,
            }}
          >
            New Report
          </Text>
        </View>

        {/* TOGGLE */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E5E7EB',
            margin: 16,
            borderRadius: 10,
            padding: 4,
          }}
        >
          {['Lost', 'Found'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setType(item as any)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: type === item ? '#fff' : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  color: type === item ? THEME : '#6B7280',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FORM */}
        <View
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 16,
            borderRadius: 14,
            padding: 16,
          }}
        >
          {/* Item Name */}
          <Text style={label}>Item Name</Text>
          <TextInput style={input} placeholder="e.g. Brown Wallet" />

          {/* Description */}
          <Text style={label}>Description</Text>
          <TextInput
            style={[input, { height: 90 }]}
            placeholder="Describe the item (brand, color, unique marks)"
            multiline
          />

          {/* Location */}
          <Text style={label}>Location (City / Address)</Text>
          <TextInput style={input} placeholder="e.g. Kandy City Center" />

          {/* Date */}
          <Text style={label}>Date</Text>
          <TextInput style={input} placeholder="Select date" />

          {/* PHOTOS */}
          <Text style={label}>Add Photos</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={photoBox}>
              <Ionicons name="camera" size={22} color={THEME} />
            </TouchableOpacity>
            <TouchableOpacity style={photoBox}>
              <Ionicons name="image" size={22} color={THEME} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 12,
              color: '#6B7280',
              marginTop: 6,
            }}
          >
            Be specific: brand, color, unique marks
          </Text>

          {/* SUBMIT */}
          <TouchableOpacity
            style={{
              backgroundColor: THEME,
              paddingVertical: 14,
              borderRadius: 10,
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              Submit Report
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const label = {
  fontSize: 14,
  fontWeight: '600' as const,
  color: '#374151',
  marginTop: 12,
  marginBottom: 6,
};

const input = {
  backgroundColor: '#F9FAFB',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 12,
  fontSize: 14,
  borderWidth: 1,
  borderColor: '#E5E7EB',
};

const photoBox = {
  width: 56,
  height: 56,
  borderRadius: 10,
  backgroundColor: '#F0FDFA',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderWidth: 1,
  borderColor: THEME,
};
