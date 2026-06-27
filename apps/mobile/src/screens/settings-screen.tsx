import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '@financial-tracker/store';
import { useLogout } from '../lib/auth-hooks';

export function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>
            {user ? `${user.first_name} ${user.last_name}` : '-'}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? '-'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Currency</Text>
          <Text style={styles.value}>{user?.currency ?? 'PHP'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => logoutMutation.mutate()}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#999', textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 },
  card: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 16, color: '#333' },
  value: { fontSize: 16, color: '#666' },
  logoutBtn: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444', padding: 14, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});
