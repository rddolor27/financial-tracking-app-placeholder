import { CreateTransactionSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export { CreateTransactionSchema };
