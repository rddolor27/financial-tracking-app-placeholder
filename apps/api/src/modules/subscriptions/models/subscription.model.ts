export class SubscriptionModel {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  platform: string;
  paymongo_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}
