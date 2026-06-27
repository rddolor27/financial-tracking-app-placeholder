import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '@financial-tracker/store';
import { useLogout } from '../lib/auth-hooks';

export function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Tracker</Text>
      <Text style={styles.subtitle}>
        {user ? `Welcome, ${user.first_name}!` : 'Track your finances, investments, and spending.'}
      </Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => logoutMutation.mutate()}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});
