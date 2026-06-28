import { UpdateAccountSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateAccountDto = z.infer<typeof UpdateAccountSchema>;
export { UpdateAccountSchema };
