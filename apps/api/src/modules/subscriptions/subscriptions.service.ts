import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan) private readonly plansRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription) private readonly subscriptionsRepo: Repository<Subscription>,
    @InjectRepository(Payment) private readonly paymentsRepo: Repository<Payment>,
  ) {}

  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.plansRepo.find({
      where: { is_active: true },
      order: { sort_order: 'ASC' },
    });
  }

  async getPlanById(planId: string): Promise<SubscriptionPlan> {
    const plan = await this.plansRepo.findOne({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionsRepo.findOne({
      where: { user_id: userId, status: 'active' },
      relations: ['plan'],
    });
  }

  async getUserFeatures(userId: string): Promise<Record<string, boolean>> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription || !subscription.plan) {
      // Free tier defaults
      return {
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
    }
    return subscription.plan.features;
  }

  async hasFeature(userId: string, feature: string): Promise<boolean> {
    const features = await this.getUserFeatures(userId);
    return features[feature] === true;
  }

  async createSubscription(
    userId: string,
    planId: string,
    platform: 'web' | 'mobile',
  ): Promise<Subscription> {
    const existing = await this.getUserSubscription(userId);
    if (existing) {
      throw new BadRequestException('User already has an active subscription');
    }

    const plan = await this.getPlanById(planId);

    const subscription = this.subscriptionsRepo.create({
      user_id: userId,
      plan_id: plan.id,
      status: 'active' as const,
      platform,
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return this.subscriptionsRepo.save(subscription) as Promise<Subscription>;
  }

  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    subscription.status = 'cancelled';
    subscription.cancelled_at = new Date();
    return this.subscriptionsRepo.save(subscription);
  }

  async recordPayment(data: {
    user_id: string;
    subscription_id: string | null;
    paymongo_payment_id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    billing_type: 'one_time' | 'monthly';
    description: string;
  }): Promise<Payment> {
    const payment = this.paymentsRepo.create({
      ...data,
      paid_at: data.status === 'paid' ? new Date() : null,
    });
    return this.paymentsRepo.save(payment) as Promise<Payment>;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
