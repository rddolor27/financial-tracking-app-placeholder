import { z } from 'zod';
import { BillFrequencyEnum } from '../enums';

export const BillReminderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  currency: z.string().length(3).default('PHP'),
  due_day: z.number().int().min(1).max(31),
  frequency: BillFrequencyEnum,
  category_id: z.string().uuid().nullable(),
  account_id: z.string().uuid().nullable(),
  reminder_days_before: z.number().int().min(0).max(30).default(3),
  is_active: z.boolean().default(true),
  last_paid_date: z.string().nullable(),
  auto_create_transaction: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type BillReminder = z.infer<typeof BillReminderSchema>;

export const CreateBillReminderSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  currency: z.string().length(3).default('PHP'),
  due_day: z.number().int().min(1).max(31),
  frequency: BillFrequencyEnum,
  category_id: z.string().uuid().nullable().optional(),
  account_id: z.string().uuid().nullable().optional(),
  reminder_days_before: z.number().int().min(0).max(30).default(3),
  auto_create_transaction: z.boolean().default(false),
});

export type CreateBillReminder = z.infer<typeof CreateBillReminderSchema>;

export const UpdateBillReminderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  due_day: z.number().int().min(1).max(31).optional(),
  frequency: BillFrequencyEnum.optional(),
  category_id: z.string().uuid().nullable().optional(),
  account_id: z.string().uuid().nullable().optional(),
  reminder_days_before: z.number().int().min(0).max(30).optional(),
  is_active: z.boolean().optional(),
  auto_create_transaction: z.boolean().optional(),
});

export type UpdateBillReminder = z.infer<typeof UpdateBillReminderSchema>;
