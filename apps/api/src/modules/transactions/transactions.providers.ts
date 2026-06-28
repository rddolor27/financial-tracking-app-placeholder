import { Inject, type Provider } from '@nestjs/common';
import { TRANSACTIONS_SERVICE, RECURRING_SERVICE } from './transactions.constants';
import { TransactionsService } from './transactions.service';
import { RecurringService } from './recurring.service';

export const InjectTransactionsService = (): PropertyDecorator &
  ParameterDecorator => Inject(TRANSACTIONS_SERVICE);

export const TransactionsProvider: Provider = {
  provide: TRANSACTIONS_SERVICE,
  useClass: TransactionsService,
};

export const InjectRecurringService = (): PropertyDecorator &
  ParameterDecorator => Inject(RECURRING_SERVICE);

export const RecurringProvider: Provider = {
  provide: RECURRING_SERVICE,
  useClass: RecurringService,
};
