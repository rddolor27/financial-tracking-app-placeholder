import { z } from 'zod';
import {
  SubscriptionStatusEnum,
  SubscriptionPlatformEnum,
  BillingTypeEnum,
  PaymentStatusEnum,
  PaymentMethodEnum,
} from '../enums';

export const SubscriptionFeaturesSchema = z.object({
  investments: z.boolean().default(false),
  pdf_parsing: z.boolean().default(false),
  insights: z.boolean().default(false),
  csv_import: z.boolean().default(false),
  goals: z.boolean().default(false),
  bill_reminders: z.boolean().default(false),
  receipt_scanning: z.boolean().default(false),
  multi_currency: z.boolean().default(false),
  data_export: z.boolean().default(false),
  transaction_search: z.boolean().default(false),
  transaction_images: z.boolean().default(false),
  transaction_location: z.boolean().default(false),
});

export type SubscriptionFeatures = z.infer<typeof SubscriptionFeaturesSchema>;

export const SubscriptionPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  slug: z.string().max(50),
  platform: SubscriptionPlatformEnum,
  billing_type: BillingTypeEnum,
  price: z.number().min(0),
  features: SubscriptionFeaturesSchema,
  max_accounts: z.number().int().positive().nullable(),
  max_transactions_per_month: z.number().int().positive().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  status: SubscriptionStatusEnum,
  platform: SubscriptionPlatformEnum,
  paymongo_subscription_id: z.string().max(255).nullable(),
  current_period_start: z.string().datetime().nullable(),
  current_period_end: z.string().datetime().nullable(),
  cancelled_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subscription_id: z.string().uuid().nullable(),
  paymongo_payment_id: z.string().max(255),
  amount: z.number().positive(),
  currency: z.string().length(3).default('PHP'),
  status: PaymentStatusEnum,
  payment_method: PaymentMethodEnum,
  billing_type: BillingTypeEnum,
  description: z.string().max(255),
  paid_at: z.string().datetime().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  created_at: z.string().datetime(),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const CheckoutRequestSchema = z.object({
  plan_id: z.string().uuid(),
  billing_type: BillingTypeEnum,
  payment_method: PaymentMethodEnum.optional(),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
