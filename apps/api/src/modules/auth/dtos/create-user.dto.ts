import { CreateUserSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export { CreateUserSchema };
