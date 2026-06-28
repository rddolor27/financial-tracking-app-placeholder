import { CreateGoalSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateGoalDto = z.infer<typeof CreateGoalSchema>;
export { CreateGoalSchema };
