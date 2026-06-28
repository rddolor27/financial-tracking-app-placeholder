import { Inject, type Provider } from '@nestjs/common';
import { ACCOUNTS_SERVICE } from './accounts.constants';
import { AccountsService } from './accounts.service';

export const InjectAccountsService = (): PropertyDecorator &
  ParameterDecorator => Inject(ACCOUNTS_SERVICE);

export const AccountsProvider: Provider = {
  provide: ACCOUNTS_SERVICE,
  useClass: AccountsService,
};
