import { RefreshTokenRequestSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type RefreshTokenDto = z.infer<typeof RefreshTokenRequestSchema>;
export { RefreshTokenRequestSchema };
