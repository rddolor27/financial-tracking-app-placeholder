import { Inject, type Provider } from '@nestjs/common';
import { USERS_SERVICE } from './users.constants';
import { UsersService } from './users.service';

export const InjectUsersService = (): PropertyDecorator &
  ParameterDecorator => Inject(USERS_SERVICE);

export const UsersProvider: Provider = {
  provide: USERS_SERVICE,
  useClass: UsersService,
};
