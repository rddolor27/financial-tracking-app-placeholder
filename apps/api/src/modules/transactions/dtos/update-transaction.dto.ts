import { UpdateTransactionSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export { UpdateTransactionSchema };
