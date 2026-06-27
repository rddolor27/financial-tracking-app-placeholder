import { z } from 'zod';

export const ExchangeRateSchema = z.object({
  id: z.string().uuid(),
  base_currency: z.string().length(3),
  target_currency: z.string().length(3),
  rate: z.number().positive(),
  fetched_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;
