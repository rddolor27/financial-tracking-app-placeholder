import type { TransactionResponse, CreateTransaction, UpdateTransaction } from '@financial-tracker/shared-types';
import { BaseService } from './base.service';

export class TransactionsService extends BaseService<TransactionResponse, CreateTransaction, UpdateTransaction> {
  constructor(client: ConstructorParameters<typeof BaseService>[0]) {
    super(client, '/transactions');
  }
}
