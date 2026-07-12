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
import { money } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';

export function BudgetsScreen() {
  const { data: budgetsData, isLoading, refetch } = useBudgets();
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateBudget();
  const { colors } = useThemeColors();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');

  const budgets = budgetsData?.data ?? [];
  const expenseCategories = (categoriesData ?? []).filter((c) => c.type === 'expense');
  const firstCategory = expenseCategories[0];
  const catMap = new Map((categoriesData ?? []).map((c) => [c.id, c.name]));

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Budgets</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={[styles.addBtn, { color: colors.primaryLight }]}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Budget amount"
            placeholderTextColor={colors.faint}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text style={[styles.formHint, { color: colors.textSecondary }]}>
            Category: {firstCategory?.name ?? 'No categories available'}
          </Text>
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            disabled={createMutation.isPending}
          >
            <Text style={styles.submitText}>{createMutation.isPending ? 'Creating…' : 'Create Budget'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={budgets}
        renderItem={({ item }) => {
          const limit = Number(item.amount);
          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardRow}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {catMap.get(item.category_id) ?? `${item.period} budget`}
                </Text>
                <Text style={[styles.cardAmount, { color: colors.text }]}>{money(limit)}</Text>
              </View>
              <View style={[styles.bar, { backgroundColor: colors.background }]}>
                <View style={[styles.barFill, { backgroundColor: colors.success, width: '0%' }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.faint }]}>
                {item.is_active ? 'Active' : 'Inactive'} · alert at {Math.round(item.alert_threshold * 100)}% · {item.period}
              </Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No budgets yet. Tap + Add to create one.</Text>
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
  formHint: { fontSize: 13, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15 },
  submitBtn: { borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { marginHorizontal: 20, marginBottom: 10, borderRadius: 16, borderWidth: 1, padding: 16 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  cardAmount: { fontSize: 15, fontWeight: '700' },
  bar: { height: 8, borderRadius: 20, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 20 },
  progressText: { fontSize: 11, marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
