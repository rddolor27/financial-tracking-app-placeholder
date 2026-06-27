import { z } from 'zod';

export const AuthProviderEnum = z.enum(['email', 'google', 'both']);
export type AuthProvider = z.infer<typeof AuthProviderEnum>;

export const AccountTypeEnum = z.enum([
  'checking',
  'savings',
  'credit_card',
  'cash',
  'investment',
  'loan',
  'e_wallet',
]);
export type AccountType = z.infer<typeof AccountTypeEnum>;

export const CategoryTypeEnum = z.enum(['expense', 'income']);
export type CategoryType = z.infer<typeof CategoryTypeEnum>;

export const TransactionTypeEnum = z.enum(['income', 'expense', 'transfer']);
export type TransactionType = z.infer<typeof TransactionTypeEnum>;

export const RecurringIntervalEnum = z.enum([
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);
export type RecurringInterval = z.infer<typeof RecurringIntervalEnum>;

export const BudgetPeriodEnum = z.enum(['weekly', 'monthly', 'yearly']);
export type BudgetPeriod = z.infer<typeof BudgetPeriodEnum>;

export const AssetTypeEnum = z.enum(['crypto', 'us_stock', 'ph_stock']);
export type AssetType = z.infer<typeof AssetTypeEnum>;

export const InvestmentTransactionTypeEnum = z.enum([
  'buy',
  'sell',
  'dividend',
]);
export type InvestmentTransactionType = z.infer<
  typeof InvestmentTransactionTypeEnum
>;

export const StatementTypeEnum = z.enum([
  'bank',
  'credit_card',
  'investment',
  'other',
]);
export type StatementType = z.infer<typeof StatementTypeEnum>;

export const ParseStatusEnum = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
]);
export type ParseStatus = z.infer<typeof ParseStatusEnum>;

export const ParseMethodEnum = z.enum([
  'rule_based',
  'llm',
  'client_side',
]);
export type ParseMethod = z.infer<typeof ParseMethodEnum>;

export const NotificationTypeEnum = z.enum([
  'budget_alert',
  'bill_reminder',
  'goal_reached',
  'sync_conflict',
  'statement_parsed',
  'system',
]);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

export const BillFrequencyEnum = z.enum(['monthly', 'quarterly', 'yearly']);
export type BillFrequency = z.infer<typeof BillFrequencyEnum>;

export const SubscriptionStatusEnum = z.enum([
  'active',
  'cancelled',
  'expired',
  'past_due',
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusEnum>;

export const SubscriptionPlatformEnum = z.enum(['web', 'mobile', 'both']);
export type SubscriptionPlatform = z.infer<typeof SubscriptionPlatformEnum>;

export const BillingTypeEnum = z.enum(['free', 'one_time', 'monthly']);
export type BillingType = z.infer<typeof BillingTypeEnum>;

export const PaymentStatusEnum = z.enum([
  'pending',
  'paid',
  'failed',
  'refunded',
]);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const PaymentMethodEnum = z.enum([
  'card',
  'gcash',
  'maya',
  'grabpay',
  'bpi_online',
  'unionbank',
]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const SyncStatusEnum = z.enum([
  'synced',
  'pending_create',
  'pending_update',
  'pending_delete',
  'conflict',
]);
export type SyncStatus = z.infer<typeof SyncStatusEnum>;
