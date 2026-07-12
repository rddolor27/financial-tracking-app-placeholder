import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@financial-tracker/store';
import { useAccounts, useTransactions } from '../lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { useThemeColors } from '../lib/use-theme';
import type { MainStackParamList } from '../navigation/root-navigator';

const QUICK_ACTIONS = [
  { label: 'Add', glyph: '＋', screen: 'Transactions' as const, gradient: true },
  { label: 'Budgets', glyph: '◔', screen: 'Budgets' as const, gradient: false },
  { label: 'Goals', glyph: '◎', screen: 'Goals' as const, gradient: false },
  { label: 'Invest', glyph: '▲', screen: 'Investments' as const, gradient: false },
];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const { data: accountsData } = useAccounts();
  const { data: txData } = useTransactions({ limit: 6 });
  const { colors } = useThemeColors();

  const accounts = accountsData?.data ?? [];
  const recentTransactions = txData?.data ?? [];

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + Number(a.balance), 0),
    [accounts],
  );

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  })();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Greeting row */}
      <View style={styles.greetRow}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryTint }]}>
          <Text style={[styles.avatarText, { color: colors.primaryLight }]}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greetSub, { color: colors.textSecondary }]}>{greeting}</Text>
          <Text style={[styles.greetName, { color: colors.text }]}>
            {user ? `${user.first_name} ${user.last_name}` : 'Welcome'}
          </Text>
        </View>
      </View>

      {/* Balance hero */}
      <View style={[styles.hero, { backgroundColor: colors.heroTo }]}>
        <View style={[styles.heroGlow, { backgroundColor: colors.primary }]} />
        <Text style={styles.heroLabel}>Total balance · ₱</Text>
        <Text style={styles.heroAmount}>{money(totalBalance)}</Text>
        <View style={styles.heroChip}>
          <Text style={styles.heroChipText}>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        {QUICK_ACTIONS.map((a) => (
          <TouchableOpacity
            key={a.label}
            onPress={() => navigation.navigate(a.screen)}
            style={[
              styles.actionTile,
              a.gradient
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.actionGlyph, { color: a.gradient ? '#fff' : colors.primaryLight }]}>
              {a.glyph}
            </Text>
            <Text style={[styles.actionLabel, { color: a.gradient ? '#fff' : colors.textSecondary }]}>
              {a.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Accounts */}
      {accounts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Accounts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
              <Text style={[styles.link, { color: colors.primaryLight }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
            {accounts.slice(0, 6).map((account) => {
              const negative = Number(account.balance) < 0;
              return (
                <View key={account.id} style={[styles.acctCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.acctDot, { backgroundColor: account.color || colors.primary }]} />
                  <Text style={[styles.acctName, { color: colors.text }]} numberOfLines={1}>{account.name}</Text>
                  {account.bank_name ? (
                    <Text style={[styles.acctSub, { color: colors.faint }]} numberOfLines={1}>{account.bank_name}</Text>
                  ) : null}
                  <Text style={[styles.acctBalance, { color: negative ? colors.danger : colors.text }]}>
                    {negative ? '−' : ''}{money(Math.abs(Number(account.balance)), account.currency)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Recent transactions */}
      <View style={styles.section}>
        <View style={[styles.sectionHead, { paddingHorizontal: 20 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={[styles.link, { color: colors.primaryLight }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          {recentTransactions.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textSecondary }]}>No transactions yet.</Text>
          ) : (
            recentTransactions.map((tx) => {
              const income = tx.type === 'income';
              return (
                <View key={tx.id} style={[styles.txRow, { borderBottomColor: colors.border2 }]}>
                  <View style={[styles.txIcon, { backgroundColor: colors.primaryTint }]}>
                    <Text style={{ color: colors.primaryLight, fontWeight: '700' }}>
                      {(tx.description?.[0] ?? '•').toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.txName, { color: colors.text }]} numberOfLines={1}>
                      {tx.description || 'Transaction'}
                    </Text>
                    <Text style={[styles.txMeta, { color: colors.faint }]}>{tx.date}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: income ? colors.successLight : colors.danger }]}>
                    {income ? '+' : '−'}{money(Math.abs(Number(tx.amount)))}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56 },
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 18 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', fontSize: 14 },
  greetSub: { fontSize: 12 },
  greetName: { fontSize: 17, fontWeight: '700', marginTop: 1 },
  hero: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.35,
  },
  heroLabel: { color: '#b3aad6', fontSize: 13, marginBottom: 6 },
  heroAmount: { color: '#fff', fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  heroChip: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: 'rgba(18,185,129,.18)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroChipText: { color: '#8affd8', fontSize: 12, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 24 },
  actionTile: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', gap: 6 },
  actionGlyph: { fontSize: 20 },
  actionLabel: { fontSize: 12, fontWeight: '600' },
  section: { marginBottom: 22 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  link: { fontSize: 12, fontWeight: '600' },
  acctCard: { width: 150, borderRadius: 16, borderWidth: 1, padding: 14 },
  acctDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 10 },
  acctName: { fontSize: 13.5, fontWeight: '700' },
  acctSub: { fontSize: 11, marginTop: 2 },
  acctBalance: { fontSize: 18, fontWeight: '700', marginTop: 10 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  txIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 13, fontWeight: '600' },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 13.5, fontWeight: '700' },
  empty: { fontSize: 13, paddingVertical: 12 },
});
