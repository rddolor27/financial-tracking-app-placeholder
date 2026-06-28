import { CheckoutRequestSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CheckoutRequestDto = z.infer<typeof CheckoutRequestSchema>;
export { CheckoutRequestSchema };
