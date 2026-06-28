import { UpdateBudgetSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateBudgetDto = z.infer<typeof UpdateBudgetSchema>;
export { UpdateBudgetSchema };
