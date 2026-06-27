import { z } from 'zod';
import { CategoryTypeEnum } from '../enums';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  name: z.string().min(1).max(100),
  type: CategoryTypeEnum,
  icon: z.string().max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  is_default: z.boolean(),
  is_hidden: z.boolean().default(false),
  parent_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: CategoryTypeEnum,
  icon: z.string().max(50).default('fa-tag'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#808080'),
  parent_id: z.string().uuid().nullable().optional(),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  is_hidden: z.boolean().optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export const CategoryResponseSchema = CategorySchema;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
