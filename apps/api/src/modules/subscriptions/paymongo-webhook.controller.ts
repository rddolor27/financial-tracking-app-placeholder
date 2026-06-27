import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger, RawBodyRequest, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import * as crypto from 'crypto';
import { Request } from 'express';

interface PayMongoEvent {
  data: {
    id: string;
    type: string;
    attributes: {
      type: string;
      data: {
        id: string;
        type: string;
        attributes: {
          amount: number;
          currency: string;
          status: string;
          description: string;
          payment_method_used: string;
          metadata: Record<string, string> | null;
        };
      };
    };
  };
}

@Controller('webhooks/paymongo')
export class PayMongoWebhookController {
  private readonly logger = new Logger(PayMongoWebhookController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('paymongo-signature') signature: string,
    @Body() body: PayMongoEvent,
  ) {
    // Verify webhook signature
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const rawBody = req.rawBody?.toString() ?? JSON.stringify(body);
      const parts = signature.split(',');
      const timestampPart = parts.find((p) => p.startsWith('t='));
      const signaturePart = parts.find((p) => p.startsWith('te='));

      if (timestampPart && signaturePart) {
        const timestamp = timestampPart.replace('t=', '');
        const expectedSig = signaturePart.replace('te=', '');
        const payload = `${timestamp}.${rawBody}`;
        const computed = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');

        if (computed !== expectedSig) {
          this.logger.warn('Invalid PayMongo webhook signature');
          return { received: false };
        }
      }
    }

    const eventType = body?.data?.attributes?.type;
    this.logger.log(`PayMongo webhook event: ${eventType}`);

    if (eventType === 'payment.paid') {
      const payment = body.data.attributes.data;
      const attrs = payment.attributes;
      const metadata = attrs.metadata ?? {};

      const userId = metadata.user_id;
      const subscriptionId = metadata.subscription_id ?? null;
      const billingType = metadata.billing_type as 'one_time' | 'monthly' ?? 'monthly';

      if (userId) {
        await this.subscriptionsService.recordPayment({
          user_id: userId,
          subscription_id: subscriptionId,
          paymongo_payment_id: payment.id,
          amount: attrs.amount / 100, // PayMongo amounts are in centavos
          currency: attrs.currency?.toUpperCase() ?? 'PHP',
          status: 'paid',
          payment_method: attrs.payment_method_used ?? 'unknown',
          billing_type: billingType,
          description: attrs.description ?? 'Subscription payment',
        });

        this.logger.log(`Payment recorded for user ${userId}: ${payment.id}`);
      }
    } else if (eventType === 'payment.failed') {
      const payment = body.data.attributes.data;
      const attrs = payment.attributes;
      const metadata = attrs.metadata ?? {};
      const userId = metadata.user_id;

      if (userId) {
        await this.subscriptionsService.recordPayment({
          user_id: userId,
          subscription_id: metadata.subscription_id ?? null,
          paymongo_payment_id: payment.id,
          amount: attrs.amount / 100,
          currency: attrs.currency?.toUpperCase() ?? 'PHP',
          status: 'failed',
          payment_method: attrs.payment_method_used ?? 'unknown',
          billing_type: (metadata.billing_type as 'one_time' | 'monthly') ?? 'monthly',
          description: attrs.description ?? 'Payment failed',
        });

        this.logger.log(`Failed payment recorded for user ${userId}: ${payment.id}`);
      }
    }

    return { received: true };
  }
}
