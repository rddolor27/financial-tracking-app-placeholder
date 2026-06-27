import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@financial-tracker/store';
import { useAccounts, useTransactions } from '../lib/crud-hooks';
import { formatCurrency } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';
import type { MainStackParamList } from '../navigation/root-navigator';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const { data: accountsData } = useAccounts();
  const { data: txData } = useTransactions({ limit: 5 });
  const { colors } = useThemeColors();

  const accounts = accountsData?.data ?? [];
  const recentTransactions = txData?.data ?? [];

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + Number(a.balance), 0),
    [accounts],
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.greeting, { color: colors.text }]}>
        {user ? `Welcome, ${user.first_name}!` : 'Financial Tracker'}
      </Text>

      {/* Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(totalBalance, 'PHP')}</Text>
        <Text style={styles.balanceSub}>{accounts.length} account{accounts.length !== 1 ? 's' : ''}</Text>
      </View>

      {/* Accounts */}
      {accounts.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Accounts</Text>
          {accounts.slice(0, 3).map((account) => (
            <View key={account.id} style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <View style={[styles.dot, { backgroundColor: account.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{account.name}</Text>
                {account.bank_name ? <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{account.bank_name}</Text> : null}
              </View>
              <Text style={[styles.rowAmount, { color: colors.text }]}>{formatCurrency(account.balance, account.currency)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Quick Links */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Goals', screen: 'Goals' as const },
            { label: 'Bills', screen: 'Bills' as const },
            { label: 'Investments', screen: 'Investments' as const },
          ].map((item) => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => navigation.navigate(item.screen)}
              style={[styles.quickLink, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.quickLinkText, { color: colors.primary }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Recent Transactions</Text>
        {recentTransactions.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet.</Text>
        ) : (
          recentTransactions.map((tx) => (
            <View key={tx.id} style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{tx.description || 'No description'}</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{tx.date}</Text>
              </View>
              <Text style={[styles.rowAmount, { color: tx.type === 'income' ? colors.success : colors.danger }]}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(Number(tx.amount), 'PHP')}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  greeting: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 16 },
  balanceCard: { marginHorizontal: 20, borderRadius: 16, padding: 24, marginBottom: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  balanceAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  balanceSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 },
  row: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 13, marginTop: 2 },
  rowAmount: { fontSize: 15, fontWeight: '700' },
  emptyText: { paddingHorizontal: 20, fontSize: 14 },
  quickLink: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  quickLinkText: { fontSize: 14, fontWeight: '600' },
});
