import { SubscriptionPlan } from '../subscription-plan.entity';

export class SubscriptionPlanModel {
  public readonly id?: string;
  public readonly name: string;
  public readonly slug: string;
  public readonly platform: 'web' | 'mobile' | 'both';
  public readonly billing_type: 'free' | 'one_time' | 'monthly';
  public readonly price: number;
  public readonly features: Record<string, boolean>;
  public readonly max_accounts?: number | null;
  public readonly max_transactions_per_month?: number | null;
  public readonly is_active: boolean;
  public readonly sort_order: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    name: string;
    slug: string;
    platform: 'web' | 'mobile' | 'both';
    billing_type: 'free' | 'one_time' | 'monthly';
    price: number;
    features: Record<string, boolean>;
    max_accounts?: number | null;
    max_transactions_per_month?: number | null;
    is_active: boolean;
    sort_order: number;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.platform = data.platform;
    this.billing_type = data.billing_type;
    this.price = data.price;
    this.features = data.features;
    this.max_accounts = data.max_accounts;
    this.max_transactions_per_month = data.max_transactions_per_month;
    this.is_active = data.is_active;
    this.sort_order = data.sort_order;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromEntity(entity: SubscriptionPlan): SubscriptionPlanModel {
    return new SubscriptionPlanModel({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      platform: entity.platform,
      billing_type: entity.billing_type,
      price: entity.price,
      features: entity.features,
      max_accounts: entity.max_accounts,
      max_transactions_per_month: entity.max_transactions_per_month,
      is_active: entity.is_active,
      sort_order: entity.sort_order,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
