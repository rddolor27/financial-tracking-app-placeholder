import { CreateBudgetSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateBudgetDto = z.infer<typeof CreateBudgetSchema>;
export { CreateBudgetSchema };
