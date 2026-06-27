import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore, useAppStore } from '@financial-tracker/store';
import { useLogout } from '../lib/auth-hooks';
import { useThemeColors } from '../lib/use-theme';

export function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const { colors } = useThemeColors();

  const cycleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(next);
  };

  const themeLabel = themeMode === 'light' ? 'Light' : themeMode === 'dark' ? 'Dark' : 'System';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 60 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 24, color: colors.text }}>
        Settings
      </Text>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 }}>
          Account
        </Text>
        <View style={{ backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, color: colors.text }}>Name</Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>
            {user ? `${user.first_name} ${user.last_name}` : '-'}
          </Text>
        </View>
        <View style={{ backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, color: colors.text }}>Email</Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>{user?.email ?? '-'}</Text>
        </View>
        <View style={{ backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, color: colors.text }}>Currency</Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>{user?.currency ?? 'PHP'}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 }}>
          Appearance
        </Text>
        <TouchableOpacity
          onPress={cycleTheme}
          style={{ backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <Text style={{ fontSize: 16, color: colors.text }}>Theme</Text>
          <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>{themeLabel}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{ marginHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.danger, padding: 14, alignItems: 'center' }}
        onPress={() => logoutMutation.mutate()}
      >
        <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '600' }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
