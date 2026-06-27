import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useInvestments, useCreateInvestment, useDeleteInvestment, useAccounts } from '../lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';

export function InvestmentsScreen() {
  const { data: investmentsData, isLoading } = useInvestments();
  const { data: accountsData } = useAccounts();
  const createMutation = useCreateInvestment();
  const deleteMutation = useDeleteInvestment();
  const { colors } = useThemeColors();

  const [showForm, setShowForm] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState<'crypto' | 'us_stock' | 'ph_stock'>('us_stock');

  const investments = investmentsData?.data ?? [];
  const accounts = accountsData?.data ?? [];
  const investmentAccounts = accounts.filter((a) => a.type === 'investment');

  const handleCreate = () => {
    if (!symbol) return;
    const accountId = investmentAccounts[0]?.id;
    if (!accountId) {
      Alert.alert('No Investment Account', 'Please create an investment account first.');
      return;
    }
    createMutation.mutate(
      {
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        asset_type: assetType,
        account_id: accountId,
        quantity: 0,
        avg_buy_price: 0,
      } as Parameters<typeof createMutation.mutate>[0],
      {
        onSuccess: () => { setSymbol(''); setShowForm(false); },
      },
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Investment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const assetTypes: Array<'crypto' | 'us_stock' | 'ph_stock'> = ['us_stock', 'ph_stock', 'crypto'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Investments</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
            {showForm ? 'Cancel' : '+ New'}
          </Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder="Symbol (e.g. AAPL, BTC)"
            placeholderTextColor={colors.textSecondary}
            value={symbol}
            onChangeText={setSymbol}
            autoCapitalize="characters"
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <View style={styles.typeRow}>
            {assetTypes.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setAssetType(t)}
                style={[
                  styles.typeBtn,
                  { borderColor: colors.border },
                  assetType === t && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text style={{ color: assetType === t ? '#fff' : colors.text, fontSize: 13 }}>
                  {t === 'us_stock' ? 'US Stock' : t === 'ph_stock' ? 'PH Stock' : 'Crypto'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCreate}>
            <Text style={styles.buttonText}>Add Investment</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>Loading...</Text>
      ) : (
        <FlatList
          data={investments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const currentValue = Number(item.quantity) * Number(item.current_price ?? item.avg_buy_price);
            const costBasis = Number(item.quantity) * Number(item.avg_buy_price);
            const pnl = currentValue - costBasis;
            return (
              <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{item.symbol}</Text>
                    <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                      {item.asset_type === 'us_stock' ? 'US Stock' : item.asset_type === 'ph_stock' ? 'PH Stock' : 'Crypto'}
                      {' · '}{Number(item.quantity)} units
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.amount, { color: colors.text }]}>
                      {formatCurrency(currentValue, 'PHP')}
                    </Text>
                    {Number(item.quantity) > 0 && (
                      <Text style={{ color: pnl >= 0 ? colors.success : colors.danger, fontSize: 13, marginTop: 2 }}>
                        {pnl >= 0 ? '+' : ''}{formatCurrency(pnl, 'PHP')}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={{ color: colors.danger, fontSize: 13, marginTop: 8 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={[styles.empty, { color: colors.textSecondary }]}>No investments yet.</Text>}
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
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  button: { borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  card: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700' },
  empty: { paddingHorizontal: 20, fontSize: 14 },
});
