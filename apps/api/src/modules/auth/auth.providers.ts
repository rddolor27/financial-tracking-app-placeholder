import { Inject, type Provider } from '@nestjs/common';
import { AUTH_SERVICE } from './auth.constants';
import { AuthService } from './auth.service';

export const InjectAuthService = (): PropertyDecorator &
  ParameterDecorator => Inject(AUTH_SERVICE);

export const AuthProvider: Provider = {
  provide: AUTH_SERVICE,
  useClass: AuthService,
};
