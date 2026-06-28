import { Subscription } from '../subscription.entity';

export class SubscriptionModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly plan_id: string;
  public readonly status: 'active' | 'cancelled' | 'expired' | 'past_due';
  public readonly platform: 'web' | 'mobile';
  public readonly paymongo_subscription_id?: string | null;
  public readonly current_period_start?: Date | null;
  public readonly current_period_end?: Date | null;
  public readonly cancelled_at?: Date | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    plan_id: string;
    status: 'active' | 'cancelled' | 'expired' | 'past_due';
    platform: 'web' | 'mobile';
    paymongo_subscription_id?: string | null;
    current_period_start?: Date | null;
    current_period_end?: Date | null;
    cancelled_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.plan_id = data.plan_id;
    this.status = data.status;
    this.platform = data.platform;
    this.paymongo_subscription_id = data.paymongo_subscription_id;
    this.current_period_start = data.current_period_start;
    this.current_period_end = data.current_period_end;
    this.cancelled_at = data.cancelled_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromEntity(entity: Subscription): SubscriptionModel {
    return new SubscriptionModel({
      id: entity.id,
      user_id: entity.user_id,
      plan_id: entity.plan_id,
      status: entity.status,
      platform: entity.platform,
      paymongo_subscription_id: entity.paymongo_subscription_id,
      current_period_start: entity.current_period_start,
      current_period_end: entity.current_period_end,
      cancelled_at: entity.cancelled_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
