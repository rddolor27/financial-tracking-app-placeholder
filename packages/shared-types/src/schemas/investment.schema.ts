import { z } from 'zod';
import { AssetTypeEnum, InvestmentTransactionTypeEnum } from '../enums';

export const InvestmentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  account_id: z.string().uuid(),
  symbol: z.string().min(1).max(20),
  name: z.string().min(1).max(255),
  asset_type: AssetTypeEnum,
  quantity: z.number().min(0),
  avg_buy_price: z.number().min(0),
  currency: z.string().length(3),
  current_price: z.number().min(0),
  price_updated_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Investment = z.infer<typeof InvestmentSchema>;

export const CreateInvestmentSchema = z.object({
  account_id: z.string().uuid(),
  symbol: z.string().min(1).max(20),
  name: z.string().min(1).max(255),
  asset_type: AssetTypeEnum,
  quantity: z.number().min(0).default(0),
  avg_buy_price: z.number().min(0).default(0),
  currency: z.string().length(3).default('USD'),
});

export type CreateInvestment = z.infer<typeof CreateInvestmentSchema>;

export const UpdateInvestmentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  quantity: z.number().min(0).optional(),
  avg_buy_price: z.number().min(0).optional(),
});

export type UpdateInvestment = z.infer<typeof UpdateInvestmentSchema>;

export const InvestmentTransactionSchema = z.object({
  id: z.string().uuid(),
  investment_id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: InvestmentTransactionTypeEnum,
  quantity: z.number().positive(),
  price_per_unit: z.number().min(0),
  total_amount: z.number().min(0),
  fees: z.number().min(0).default(0),
  date: z.string(),
  notes: z.string().max(500).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type InvestmentTransaction = z.infer<typeof InvestmentTransactionSchema>;

export const CreateInvestmentTransactionSchema = z.object({
  investment_id: z.string().uuid(),
  type: InvestmentTransactionTypeEnum,
  quantity: z.number().positive(),
  price_per_unit: z.number().min(0),
  fees: z.number().min(0).default(0),
  date: z.string(),
  notes: z.string().max(500).nullable().optional(),
});

export type CreateInvestmentTransaction = z.infer<typeof CreateInvestmentTransactionSchema>;
