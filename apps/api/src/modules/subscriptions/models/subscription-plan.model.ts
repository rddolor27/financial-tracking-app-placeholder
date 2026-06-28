export class SubscriptionPlanModel {
  id: string;
  name: string;
  slug: string;
  platform: string;
  billing_type: string;
  price: number;
  features: Record<string, any>;
  max_accounts: number;
  max_transactions_per_month: number;
  is_active: boolean;
  sort_order: number;
}
