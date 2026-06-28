import { Inject, type Provider } from '@nestjs/common';
import { BUDGETS_SERVICE } from './budgets.constants';
import { BudgetsService } from './budgets.service';

export const InjectBudgetsService = (): PropertyDecorator &
  ParameterDecorator => Inject(BUDGETS_SERVICE);

export const BudgetsProvider: Provider = {
  provide: BUDGETS_SERVICE,
  useClass: BudgetsService,
};
