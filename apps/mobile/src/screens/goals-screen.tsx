import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGoals, useCreateGoal, useContributeGoal, useDeleteGoal } from '../lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';

export function GoalsScreen() {
  const { data: goals, isLoading } = useGoals();
  const createMutation = useCreateGoal();
  const contributeMutation = useContributeGoal();
  const deleteMutation = useDeleteGoal();
  const { colors } = useThemeColors();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const goalsList = goals ?? [];

  const handleCreate = () => {
    if (!name || !targetAmount) return;
    createMutation.mutate(
      { name, target_amount: Number(targetAmount), currency: 'PHP' } as Parameters<typeof createMutation.mutate>[0],
      {
        onSuccess: () => { setName(''); setTargetAmount(''); setShowForm(false); },
      },
    );
  };

  const handleContribute = (id: string) => {
    if (!contributeAmount) return;
    contributeMutation.mutate(
      { id, data: { amount: Number(contributeAmount) } },
      { onSuccess: () => { setContributeId(null); setContributeAmount(''); } },
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Goals</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
            {showForm ? 'Cancel' : '+ New'}
          </Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Goal name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            placeholder="Target amount"
            placeholderTextColor={colors.textSecondary}
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>Loading...</Text>
      ) : (
        <FlatList
          data={goalsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const progress = item.target_amount > 0 ? Math.min(Number(item.current_amount) / Number(item.target_amount), 1) : 0;
            return (
              <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={{ color: colors.danger }}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                  {formatCurrency(Number(item.current_amount), 'PHP')} / {formatCurrency(Number(item.target_amount), 'PHP')}
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: item.is_completed ? colors.success : colors.primary }]} />
                </View>
                {item.is_completed ? (
                  <Text style={[styles.cardSub, { color: colors.success, marginTop: 4 }]}>Completed!</Text>
                ) : (
                  contributeId === item.id ? (
                    <View style={styles.contributeRow}>
                      <TextInput
                        placeholder="Amount"
                        placeholderTextColor={colors.textSecondary}
                        value={contributeAmount}
                        onChangeText={setContributeAmount}
                        keyboardType="numeric"
                        style={[styles.input, { flex: 1, backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                      />
                      <TouchableOpacity
                        style={[styles.smallBtn, { backgroundColor: colors.success }]}
                        onPress={() => handleContribute(item.id)}
                      >
                        <Text style={styles.buttonText}>Add</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setContributeId(null)}>
                        <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setContributeId(item.id)}>
                      <Text style={{ color: colors.primary, marginTop: 8 }}>+ Contribute</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            );
          }}
          ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No goals yet.</Text>}
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
  cardSub: { fontSize: 13, marginTop: 4 },
  progressBar: { height: 6, borderRadius: 3, marginTop: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  contributeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  smallBtn: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, marginLeft: 8 },
  empty: { paddingHorizontal: 20, fontSize: 14 },
});
