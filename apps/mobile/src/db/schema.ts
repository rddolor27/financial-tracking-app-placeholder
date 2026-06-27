import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  server_id: text('server_id'),
  name: text('name').notNull(),
  bank_name: text('bank_name'),
  type: text('type').notNull(),
  balance: real('balance').notNull().default(0),
  currency: text('currency').notNull().default('PHP'),
  color: text('color').notNull().default('#4A90D9'),
  icon: text('icon').notNull().default('fa-wallet'),
  logo_url: text('logo_url'),
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sync_status: text('sync_status').notNull().default('synced'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  server_id: text('server_id'),
  name: text('name').notNull(),
  type: text('type').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  is_default: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  is_hidden: integer('is_hidden', { mode: 'boolean' }).notNull().default(false),
  parent_id: text('parent_id'),
  sync_status: text('sync_status').notNull().default('synced'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  server_id: text('server_id'),
  account_id: text('account_id').notNull(),
  category_id: text('category_id').notNull(),
  type: text('type').notNull(),
  amount: real('amount').notNull(),
  description: text('description'),
  date: text('date').notNull(),
  transfer_to_account_id: text('transfer_to_account_id'),
  image_url: text('image_url'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  location_name: text('location_name'),
  is_recurring: integer('is_recurring', { mode: 'boolean' }).notNull().default(false),
  recurring_interval: text('recurring_interval'),
  tags: text('tags').notNull().default('[]'),
  sync_status: text('sync_status').notNull().default('synced'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const syncQueue = sqliteTable('sync_queue', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entity_type: text('entity_type').notNull(),
  entity_id: text('entity_id').notNull(),
  action: text('action').notNull(),
  payload: text('payload').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  retry_count: integer('retry_count').notNull().default(0),
});
