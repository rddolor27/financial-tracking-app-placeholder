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
import { formatCurrency } from '@financial-tracker/shared-utils';

export function AccountsScreen() {
  const { data: accountsData, isLoading, refetch } = useAccounts();
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();
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
      color: '#4A90D9',
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

  const renderItem = ({ item }: { item: AccountResponse }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => handleDelete(item.id, item.name)}
    >
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.bank_name ? <Text style={styles.cardSub}>{item.bank_name}</Text> : null}
        <Text style={styles.cardAmount}>{formatCurrency(item.balance, item.currency)}</Text>
      </View>
      <Text style={styles.cardType}>{item.type.replace('_', ' ')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtn}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Account name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Bank name (optional)"
            value={bankName}
            onChangeText={setBankName}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleCreate}
            disabled={createMutation.isPending}
          >
            <Text style={styles.submitText}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Text>
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
          <Text style={styles.empty}>No accounts yet. Tap + Add to create one.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { fontSize: 16, color: '#2563EB', fontWeight: '600' },
  form: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  submitBtn: { backgroundColor: '#2563EB', borderRadius: 8, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 8, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 2 },
  cardAmount: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  cardType: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
