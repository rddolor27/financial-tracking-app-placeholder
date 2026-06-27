import type { AccountResponse, CreateAccount, UpdateAccount } from '@financial-tracker/shared-types';
import { BaseService } from './base.service';

export class AccountsService extends BaseService<AccountResponse, CreateAccount, UpdateAccount> {
  constructor(client: ConstructorParameters<typeof BaseService>[0]) {
    super(client, '/accounts');
  }
}
