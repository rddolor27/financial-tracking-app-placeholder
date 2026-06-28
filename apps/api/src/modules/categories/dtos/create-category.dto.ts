import { CreateCategorySchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export { CreateCategorySchema };
