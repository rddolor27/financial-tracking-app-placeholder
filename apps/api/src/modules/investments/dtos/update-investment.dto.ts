import { UpdateInvestmentSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateInvestmentDto = z.infer<typeof UpdateInvestmentSchema>;
export { UpdateInvestmentSchema };
