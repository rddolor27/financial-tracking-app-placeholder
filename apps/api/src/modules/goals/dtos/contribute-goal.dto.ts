import { ContributeGoalSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type ContributeGoalDto = z.infer<typeof ContributeGoalSchema>;
export { ContributeGoalSchema };
