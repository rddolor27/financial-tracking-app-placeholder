import { z } from 'zod';

export const GoalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  target_amount: z.number().positive(),
  current_amount: z.number().min(0).default(0),
  currency: z.string().length(3).default('PHP'),
  target_date: z.string().nullable(),
  icon: z.string().max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  is_completed: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Goal = z.infer<typeof GoalSchema>;

export const CreateGoalSchema = z.object({
  name: z.string().min(1).max(100),
  target_amount: z.number().positive(),
  currency: z.string().length(3).default('PHP'),
  target_date: z.string().nullable().optional(),
  icon: z.string().max(50).default('fa-bullseye'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#4CAF50'),
});

export type CreateGoal = z.infer<typeof CreateGoalSchema>;

export const UpdateGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  target_amount: z.number().positive().optional(),
  target_date: z.string().nullable().optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;

export const ContributeGoalSchema = z.object({
  amount: z.number().positive(),
});

export type ContributeGoal = z.infer<typeof ContributeGoalSchema>;
