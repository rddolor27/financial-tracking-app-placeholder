import { Inject, type Provider } from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from './notifications.constants';
import { NotificationsService } from './notifications.service';

export const InjectNotificationsService = (): PropertyDecorator &
  ParameterDecorator => Inject(NOTIFICATIONS_SERVICE);

export const NotificationsProvider: Provider = {
  provide: NOTIFICATIONS_SERVICE,
  useClass: NotificationsService,
};
