import { UpdateUserSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export { UpdateUserSchema };
