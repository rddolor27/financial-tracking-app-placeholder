import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBillReminders, useCreateBillReminder, useDeleteBillReminder } from '../lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';

export function BillsScreen() {
  const { data: bills, isLoading } = useBillReminders();
  const createMutation = useCreateBillReminder();
  const deleteMutation = useDeleteBillReminder();
  const { colors } = useThemeColors();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');

  const billsList = bills ?? [];

  const handleCreate = () => {
    if (!name || !amount || !dueDay) return;
    createMutation.mutate(
      {
        name,
        amount: Number(amount),
        due_day: Number(dueDay),
        frequency: 'monthly',
        currency: 'PHP',
        reminder_days_before: 3,
        is_active: true,
        auto_create_transaction: false,
      } as Parameters<typeof createMutation.mutate>[0],
      {
        onSuccess: () => { setName(''); setAmount(''); setDueDay(''); setShowForm(false); },
      },
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Bill Reminder', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bill Reminders</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
            {showForm ? 'Cancel' : '+ New'}
          </Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Bill name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            placeholder="Amount"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            placeholder="Due day (1-31)"
            placeholderTextColor={colors.textSecondary}
            value={dueDay}
            onChangeText={setDueDay}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCreate}>
            <Text style={styles.buttonText}>Add Bill Reminder</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>Loading...</Text>
      ) : (
        <FlatList
          data={billsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                    Due day {item.due_day} &middot; {item.frequency}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.amount, { color: colors.text }]}>
                    {formatCurrency(Number(item.amount), item.currency)}
                  </Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={{ color: colors.danger, fontSize: 13, marginTop: 4 }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: item.is_active ? colors.success + '20' : colors.border }]}>
                  <Text style={{ color: item.is_active ? colors.success : colors.textSecondary, fontSize: 12 }}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                {item.auto_create_transaction && (
                  <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={{ color: colors.primary, fontSize: 12 }}>Auto-pay</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No bill reminders yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  form: { marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 8 },
  button: { borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  card: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  empty: { paddingHorizontal: 20, fontSize: 14 },
});
