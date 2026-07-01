import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './subscriptions.controller';
import { PayMongoWebhookController } from './paymongo-webhook.controller';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';
import { SubscriptionsProvider } from './subscriptions.service';
import { SUBSCRIPTIONS_SERVICE } from './subscriptions.constants';
import { SubscriptionGuard } from './subscription.guard';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, Subscription, Payment])],
  controllers: [SubscriptionsController, PayMongoWebhookController],
  providers: [SubscriptionsProvider, SubscriptionGuard],
  exports: [SUBSCRIPTIONS_SERVICE, SubscriptionGuard],
})
export class SubscriptionsModule {}
