import { CreateInvestmentTransactionSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateInvestmentTransactionDto = z.infer<typeof CreateInvestmentTransactionSchema>;
export { CreateInvestmentTransactionSchema };
