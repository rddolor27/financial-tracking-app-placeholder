import { z } from 'zod';
import { AccountTypeEnum } from '../enums';

export const AccountSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  bank_name: z.string().max(100).nullable(),
  type: AccountTypeEnum,
  balance: z.number(),
  currency: z.string().length(3),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().max(50),
  logo_url: z.string().url().max(500).nullable(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Account = z.infer<typeof AccountSchema>;

export const CreateAccountSchema = z.object({
  name: z.string().min(1).max(100),
  bank_name: z.string().max(100).nullable().optional(),
  type: AccountTypeEnum,
  balance: z.number().default(0),
  currency: z.string().length(3).default('PHP'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4A90D9'),
  icon: z.string().max(50).default('fa-wallet'),
});

export type CreateAccount = z.infer<typeof CreateAccountSchema>;

export const UpdateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bank_name: z.string().max(100).nullable().optional(),
  type: AccountTypeEnum.optional(),
  balance: z.number().optional(),
  currency: z.string().length(3).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(50).optional(),
  logo_url: z.string().url().max(500).nullable().optional(),
  is_active: z.boolean().optional(),
});

export type UpdateAccount = z.infer<typeof UpdateAccountSchema>;

export const AccountResponseSchema = AccountSchema;
export type AccountResponse = z.infer<typeof AccountResponseSchema>;
