import { Inject, type Provider } from '@nestjs/common';
import { SUBSCRIPTIONS_SERVICE } from './subscriptions.constants';
import { SubscriptionsService } from './subscriptions.service';

export const InjectSubscriptionsService = (): PropertyDecorator &
  ParameterDecorator => Inject(SUBSCRIPTIONS_SERVICE);

export const SubscriptionsProvider: Provider = {
  provide: SUBSCRIPTIONS_SERVICE,
  useClass: SubscriptionsService,
};
