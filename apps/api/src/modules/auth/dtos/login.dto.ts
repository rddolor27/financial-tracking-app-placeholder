import { LoginSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type LoginDto = z.infer<typeof LoginSchema>;
export { LoginSchema };
