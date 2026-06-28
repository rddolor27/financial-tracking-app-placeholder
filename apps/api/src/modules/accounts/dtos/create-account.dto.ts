import { CreateAccountSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateAccountDto = z.infer<typeof CreateAccountSchema>;
export { CreateAccountSchema };
