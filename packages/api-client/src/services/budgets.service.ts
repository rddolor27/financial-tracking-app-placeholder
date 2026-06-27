import type { BudgetResponse, CreateBudget, UpdateBudget } from '@financial-tracker/shared-types';
import { BaseService } from './base.service';

export class BudgetsService extends BaseService<BudgetResponse, CreateBudget, UpdateBudget> {
  constructor(client: ConstructorParameters<typeof BaseService>[0]) {
    super(client, '/budgets');
  }
}
