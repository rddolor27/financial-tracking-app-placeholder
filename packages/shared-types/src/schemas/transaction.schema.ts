import { z } from 'zod';
import { TransactionTypeEnum, RecurringIntervalEnum } from '../enums';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  account_id: z.string().uuid(),
  category_id: z.string().uuid(),
  type: TransactionTypeEnum,
  amount: z.number().positive(),
  description: z.string().max(500).nullable(),
  date: z.string(),
  transfer_to_account_id: z.string().uuid().nullable(),
  image_url: z.string().max(500).nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  location_name: z.string().max(255).nullable(),
  is_recurring: z.boolean().default(false),
  recurring_interval: RecurringIntervalEnum.nullable(),
  recurring_next_date: z.string().nullable(),
  tags: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = z
  .object({
    account_id: z.string().uuid(),
    category_id: z.string().uuid(),
    type: TransactionTypeEnum,
    amount: z.number().positive(),
    description: z.string().max(500).nullable().optional(),
    date: z.string(),
    transfer_to_account_id: z.string().uuid().nullable().optional(),
    image_url: z.string().max(500).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    location_name: z.string().max(255).nullable().optional(),
    is_recurring: z.boolean().default(false),
    recurring_interval: RecurringIntervalEnum.nullable().optional(),
    tags: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.type === 'transfer') {
        return !!data.transfer_to_account_id;
      }
      return true;
    },
    {
      message: 'transfer_to_account_id is required for transfer transactions',
      path: ['transfer_to_account_id'],
    },
  )
  .refine(
    (data) => {
      if (data.is_recurring) {
        return !!data.recurring_interval;
      }
      return true;
    },
    {
      message: 'recurring_interval is required when is_recurring is true',
      path: ['recurring_interval'],
    },
  );

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

export const UpdateTransactionSchema = z.object({
  account_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  type: TransactionTypeEnum.optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(500).nullable().optional(),
  date: z.string().optional(),
  transfer_to_account_id: z.string().uuid().nullable().optional(),
  image_url: z.string().max(500).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  location_name: z.string().max(255).nullable().optional(),
  is_recurring: z.boolean().optional(),
  recurring_interval: RecurringIntervalEnum.nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;

export const TransactionResponseSchema = TransactionSchema;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
