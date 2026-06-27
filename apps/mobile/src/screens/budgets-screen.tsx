import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBudgets, useCreateBudget, useCategories } from '../lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';

export function BudgetsScreen() {
  const { data: budgetsData, isLoading, refetch } = useBudgets();
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateBudget();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');

  const budgets = budgetsData?.data ?? [];
  const expenseCategories = (categoriesData ?? []).filter((c) => c.type === 'expense');
  const firstCategory = expenseCategories[0];

  const handleCreate = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !firstCategory) return;

    await createMutation.mutateAsync({
      category_id: firstCategory.id,
      amount: parsedAmount,
      period: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      alert_threshold: 0.8,
    });
    setAmount('');
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtn}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Budget amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text style={styles.formHint}>
            Category: {firstCategory?.name ?? 'No categories available'}
          </Text>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleCreate}
            disabled={createMutation.isPending}
          >
            <Text style={styles.submitText}>
              {createMutation.isPending ? 'Creating...' : 'Create Budget'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={budgets}
        renderItem={({ item }) => {
          const limit = Number(item.amount);

          return (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.period} budget</Text>
                <Text style={styles.cardAmount}>
                  {formatCurrency(limit, 'PHP')}
                </Text>
              </View>
              <Text style={styles.progressText}>
                {item.is_active ? 'Active' : 'Inactive'} &middot; Alert at {Math.round(item.alert_threshold * 100)}%
              </Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.empty}>No budgets yet. Tap + Add to create one.</Text>
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
  formHint: { fontSize: 13, color: '#666', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  submitBtn: { backgroundColor: '#2563EB', borderRadius: 8, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 8, borderRadius: 12, padding: 16 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600', textTransform: 'capitalize' },
  cardAmount: { fontSize: 14, fontWeight: '600' },
  progressText: { fontSize: 12, color: '#999', marginTop: 4 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
