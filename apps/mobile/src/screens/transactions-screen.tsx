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
import { money } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';

export function TransactionsScreen() {
  const { data: txData, isLoading, refetch } = useTransactions();
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction();
  const { colors } = useThemeColors();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={[styles.addBtn, { color: colors.primaryLight }]}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                { borderColor: colors.border },
                type === 'expense' && { backgroundColor: colors.danger, borderColor: colors.danger },
              ]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeText, { color: type === 'expense' ? '#fff' : colors.textSecondary }]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                { borderColor: colors.border },
                type === 'income' && { backgroundColor: colors.success, borderColor: colors.success },
              ]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeText, { color: type === 'income' ? '#fff' : colors.textSecondary }]}>Income</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Amount"
            placeholderTextColor={colors.faint}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.faint}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            disabled={createMutation.isPending}
          >
            <Text style={styles.submitText}>{createMutation.isPending ? 'Creating…' : 'Add Transaction'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={transactions}
        renderItem={({ item }) => {
          const income = item.type === 'income';
          return (
            <TouchableOpacity
              style={[styles.card, { borderBottomColor: colors.border2 }]}
              onLongPress={() => handleDelete(item.id)}
            >
              <View style={[styles.txIcon, { backgroundColor: colors.primaryTint }]}>
                <Text style={{ color: colors.primaryLight, fontWeight: '700' }}>
                  {(item.description?.[0] ?? '•').toUpperCase()}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardDesc, { color: colors.text }]} numberOfLines={1}>
                  {item.description || 'Transaction'}
                </Text>
                <Text style={[styles.cardDate, { color: colors.faint }]}>{item.date}</Text>
              </View>
              <Text style={[styles.cardAmount, { color: income ? colors.successLight : colors.danger }]}>
                {income ? '+' : '−'}{money(Math.abs(Number(item.amount)))}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No transactions yet.</Text>}
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
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  typeText: { fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15 },
  submitBtn: { borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { marginBottom: 0, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1 },
  txIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardDesc: { fontSize: 14, fontWeight: '600' },
  cardDate: { fontSize: 11, marginTop: 2 },
  cardAmount: { fontSize: 14, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
