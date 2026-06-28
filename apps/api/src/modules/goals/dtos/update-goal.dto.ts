import { UpdateGoalSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateGoalDto = z.infer<typeof UpdateGoalSchema>;
export { UpdateGoalSchema };
