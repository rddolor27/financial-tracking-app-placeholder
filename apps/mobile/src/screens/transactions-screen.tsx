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
import { useTransactions, useCreateTransaction, useDeleteTransaction, useAccounts, useCategories } from '../lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

export function TransactionsScreen() {
  const { data: txData, isLoading, refetch } = useTransactions();
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const transactions = txData?.data ?? [];
  const accounts = accountsData?.data ?? [];
  const categories = (categoriesData ?? []).filter((c) => c.type === type);
  const firstAccount = accounts[0];
  const firstCategory = categories[0];

  const handleCreate = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!firstAccount || !firstCategory) {
      Alert.alert('Missing data', 'Create an account and category first.');
      return;
    }

    await createMutation.mutateAsync({
      account_id: firstAccount.id,
      category_id: firstCategory.id,
      type,
      amount: parsedAmount,
      description: description.trim() || null,
      date: new Date().toISOString().split('T')[0],
      is_recurring: false,
      tags: [],
    });
    setDescription('');
    setAmount('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtn}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveGreen]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleCreate}
            disabled={createMutation.isPending}
          >
            <Text style={styles.submitText}>
              {createMutation.isPending ? 'Creating...' : 'Add Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onLongPress={() => handleDelete(item.id)}>
            <View style={styles.cardContent}>
              <Text style={styles.cardDesc}>{item.description || 'No description'}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <Text style={[styles.cardAmount, item.type === 'income' ? styles.income : styles.expense]}>
              {item.type === 'income' ? '+' : '-'}{formatCurrency(Number(item.amount), 'PHP')}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions yet.</Text>
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
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  typeBtnActiveGreen: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  typeText: { fontWeight: '600', color: '#666' },
  typeTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  submitBtn: { backgroundColor: '#2563EB', borderRadius: 8, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 8, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardDesc: { fontSize: 15, fontWeight: '500' },
  cardDate: { fontSize: 13, color: '#999', marginTop: 2 },
  cardAmount: { fontSize: 16, fontWeight: '700' },
  income: { color: '#22C55E' },
  expense: { color: '#EF4444' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
