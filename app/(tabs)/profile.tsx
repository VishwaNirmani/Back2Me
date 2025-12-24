import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const THEME = '#2FB9B0';

export default function Profile() {
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
            }}
          >
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
            }}
          >
            <Ionicons name="person" size={42} color={THEME} />
          </View>

          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
            John Doe
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            Colombo, Sri Lanka
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            john.doe@gmail.com
          </Text>

          {/* STATS */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              gap: 12,
            }}
          >
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

        {/* ACTION BUTTONS */}
        <View style={{ marginHorizontal: 16 }}>
          <TouchableOpacity style={primaryBtn}>
            <Text style={primaryText}>My Found Items</Text>
          </TouchableOpacity>

          <TouchableOpacity style={secondaryBtn}>
            <Text style={secondaryText}>Edit Profile</Text>
          </TouchableOpacity>
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
          <SettingItem icon="log-out-outline" label="Logout" danger />
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
}: {
  icon: any;
  label: string;
  danger?: boolean;
}) => (
  <TouchableOpacity
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

/* ---------------- STYLES ---------------- */

const primaryBtn = {
  backgroundColor: THEME,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center' as const,
  marginBottom: 10,
};

const primaryText = {
  color: '#fff',
  fontSize: 15,
  fontWeight: '700' as const,
};

const secondaryBtn = {
  backgroundColor: '#fff',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: THEME,
};

const secondaryText = {
  color: THEME,
  fontSize: 15,
  fontWeight: '700' as const,
};
