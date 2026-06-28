import { UpdateCategorySchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
export { UpdateCategorySchema };
