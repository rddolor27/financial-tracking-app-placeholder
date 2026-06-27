import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  API_PORT: z.coerce.number().default(3000),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_DATABASE: z.string().default('financial_tracker'),

  // JWT
  JWT_ACCESS_SECRET: z.string().default('dev-access-secret'),
  JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .default('http://localhost:3000/api/auth/google/callback'),

  // Market Data
  COINGECKO_API_KEY: z.string().optional(),
  ALPHA_VANTAGE_API_KEY: z.string().optional(),

  // Exchange Rates
  EXCHANGE_RATE_API_KEY: z.string().optional(),

  // PayMongo
  PAYMONGO_SECRET_KEY: z.string().optional(),
  PAYMONGO_PUBLIC_KEY: z.string().optional(),
  PAYMONGO_WEBHOOK_SECRET: z.string().optional(),
  PAYMONGO_CHECKOUT_SUCCESS_URL: z
    .string()
    .default('http://localhost:3001/subscription/success'),
  PAYMONGO_CHECKOUT_CANCEL_URL: z
    .string()
    .default('http://localhost:3001/subscription/cancel'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    process.exit(1);
  }
  return result.data;
}
