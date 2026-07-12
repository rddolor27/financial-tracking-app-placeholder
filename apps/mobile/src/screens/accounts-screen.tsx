import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import type { AccountResponse } from '@financial-tracker/shared-types';
import { useAccounts, useCreateAccount, useDeleteAccount } from '../lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';

export function AccountsScreen() {
  const { data: accountsData, isLoading, refetch } = useAccounts();
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();
  const { colors } = useThemeColors();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');

  const accounts: AccountResponse[] = accountsData?.data ?? [];

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createMutation.mutateAsync({
      name: name.trim(),
      type: 'checking',
      bank_name: bankName.trim() || null,
      balance: 0,
      currency: 'PHP',
      color: '#3b82f6',
      icon: 'fa-wallet',
    });
    setName('');
    setBankName('');
    setShowForm(false);
  };

  const handleDelete = (id: string, accountName: string) => {
    Alert.alert('Delete Account', `Delete "${accountName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const renderItem = ({ item }: { item: AccountResponse }) => {
    const negative = Number(item.balance) < 0 || item.type === 'credit_card' || item.type === 'loan';
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onLongPress={() => handleDelete(item.id, item.name)}
      >
        <View style={[styles.iconBox, { backgroundColor: colors.primaryTint }]}>
          <Text style={{ color: item.color || colors.primaryLight, fontWeight: '800' }}>
            {item.name[0]?.toUpperCase() ?? '•'}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.cardSub, { color: colors.faint }]}>
            {item.type.replace('_', ' ')}{item.bank_name ? ` · ${item.bank_name}` : ''}
          </Text>
          <Text style={[styles.cardAmount, { color: negative ? colors.danger : colors.text }]}>
            {Number(item.balance) < 0 ? '−' : ''}{money(Math.abs(Number(item.balance)), item.currency)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Accounts</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={[styles.addBtn, { color: colors.primaryLight }]}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Account name"
            placeholderTextColor={colors.faint}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Bank name (optional)"
            placeholderTextColor={colors.faint}
            value={bankName}
            onChangeText={setBankName}
          />
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            disabled={createMutation.isPending}
          >
            <Text style={styles.submitText}>{createMutation.isPending ? 'Creating…' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={accounts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No accounts yet. Tap + Add to create one.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  addBtn: { fontSize: 15, fontWeight: '700' },
  form: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15 },
  submitBtn: { borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { marginHorizontal: 20, marginBottom: 10, borderRadius: 16, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSub: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  cardAmount: { fontSize: 20, fontWeight: '700', marginTop: 6 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
