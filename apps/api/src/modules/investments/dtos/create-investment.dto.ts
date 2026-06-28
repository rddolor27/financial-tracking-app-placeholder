import { CreateInvestmentSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateInvestmentDto = z.infer<typeof CreateInvestmentSchema>;
export { CreateInvestmentSchema };
