import { DataSource } from 'typeorm';
import { SubscriptionPlan } from '../../modules/subscriptions/subscription-plan.entity';

const FREE_FEATURES = {
  investments: false,
  pdf_parsing: false,
  insights: false,
  csv_import: false,
  goals: false,
  bill_reminders: false,
  receipt_scanning: false,
  multi_currency: false,
  data_export: false,
  transaction_search: false,
  transaction_images: false,
  transaction_location: false,
};

const PREMIUM_FEATURES = {
  investments: true,
  pdf_parsing: true,
  insights: true,
  csv_import: true,
  goals: true,
  bill_reminders: true,
  receipt_scanning: true,
  multi_currency: true,
  data_export: true,
  transaction_search: true,
  transaction_images: true,
  transaction_location: true,
};

export async function seedSubscriptionPlans(
  dataSource: DataSource,
): Promise<void> {
  const repo = dataSource.getRepository(SubscriptionPlan);

  const plans = [
    {
      name: 'Free',
      slug: 'free',
      platform: 'both' as const,
      billing_type: 'free' as const,
      price: 0,
      features: FREE_FEATURES,
      max_accounts: 2,
      max_transactions_per_month: 50,
      sort_order: 0,
    },
    {
      name: 'Premium Web',
      slug: 'premium-web',
      platform: 'web' as const,
      billing_type: 'monthly' as const,
      price: 199,
      features: PREMIUM_FEATURES,
      max_accounts: null,
      max_transactions_per_month: null,
      sort_order: 1,
    },
    {
      name: 'Premium Mobile',
      slug: 'premium-mobile',
      platform: 'mobile' as const,
      billing_type: 'one_time' as const,
      price: 499,
      features: PREMIUM_FEATURES,
      max_accounts: null,
      max_transactions_per_month: null,
      sort_order: 2,
    },
  ];

  for (const plan of plans) {
    const existing = await repo.findOne({ where: { slug: plan.slug } });
    if (!existing) {
      await repo.save(repo.create(plan));
    }
  }

  console.log(`Seeded ${plans.length} subscription plans`);
}
