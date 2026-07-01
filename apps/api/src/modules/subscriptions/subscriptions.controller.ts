import { Controller, Get, Post, Body, UseGuards, Req, Delete } from '@nestjs/common';
import type { SubscriptionsService } from './subscriptions.service';
import { InjectSubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutRequestDto } from './dtos/checkout-request.dto';
import { SubscriptionModel } from './models/subscription.model';
import { SubscriptionPlanModel } from './models/subscription-plan.model';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectSubscriptionsService() private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Get('plans')
  async getPlans(): Promise<SubscriptionPlanModel[]> {
    return this.subscriptionsService.getPlans();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMySubscription(@Req() req: { user: { id: string } }): Promise<SubscriptionModel | null> {
    return this.subscriptionsService.getUserSubscription(req.user.id);
  }

  @Get('features')
  @UseGuards(JwtAuthGuard)
  async getMyFeatures(@Req() req: { user: { id: string } }): Promise<Record<string, boolean>> {
    return this.subscriptionsService.getUserFeatures(req.user.id);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Req() req: { user: { id: string } },
    @Body() body: CheckoutRequestDto,
  ): Promise<SubscriptionModel> {
    return this.subscriptionsService.createSubscription(req.user.id, body.plan_id, body.platform);
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  async cancel(@Req() req: { user: { id: string } }): Promise<SubscriptionModel> {
    return this.subscriptionsService.cancelSubscription(req.user.id);
  }

  @Get('payments')
  @UseGuards(JwtAuthGuard)
  async getPayments(@Req() req: { user: { id: string } }) {
    return this.subscriptionsService.getUserPayments(req.user.id);
  }
}
