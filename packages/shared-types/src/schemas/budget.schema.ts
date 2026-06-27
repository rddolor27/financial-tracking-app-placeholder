import { z } from 'zod';
import { BudgetPeriodEnum } from '../enums';

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category_id: z.string().uuid(),
  amount: z.number().positive(),
  period: BudgetPeriodEnum,
  start_date: z.string(),
  end_date: z.string().nullable(),
  alert_threshold: z.number().min(0).max(1).default(0.8),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Budget = z.infer<typeof BudgetSchema>;

export const CreateBudgetSchema = z.object({
  category_id: z.string().uuid(),
  amount: z.number().positive(),
  period: BudgetPeriodEnum,
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  alert_threshold: z.number().min(0).max(1).default(0.8),
});

export type CreateBudget = z.infer<typeof CreateBudgetSchema>;

export const UpdateBudgetSchema = z.object({
  amount: z.number().positive().optional(),
  period: BudgetPeriodEnum.optional(),
  start_date: z.string().optional(),
  end_date: z.string().nullable().optional(),
  alert_threshold: z.number().min(0).max(1).optional(),
  is_active: z.boolean().optional(),
});

export type UpdateBudget = z.infer<typeof UpdateBudgetSchema>;

export const BudgetResponseSchema = BudgetSchema;
export type BudgetResponse = z.infer<typeof BudgetResponseSchema>;
