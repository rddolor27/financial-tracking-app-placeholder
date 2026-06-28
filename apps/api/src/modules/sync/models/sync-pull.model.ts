import { AccountModel } from '../../accounts/models/account.model';
import { CategoryModel } from '../../categories/models/category.model';
import { TransactionModel } from '../../transactions/models/transaction.model';
import { BudgetModel } from '../../budgets/models/budget.model';

export class SyncPullModel {
  public readonly accounts: AccountModel[];
  public readonly categories: CategoryModel[];
  public readonly transactions: TransactionModel[];
  public readonly budgets: BudgetModel[];
  public readonly serverTime: string;

  private constructor(data: {
    accounts: AccountModel[];
    categories: CategoryModel[];
    transactions: TransactionModel[];
    budgets: BudgetModel[];
    serverTime: string;
  }) {
    this.accounts = data.accounts;
    this.categories = data.categories;
    this.transactions = data.transactions;
    this.budgets = data.budgets;
    this.serverTime = data.serverTime;
  }

  static create(
    accounts: AccountModel[],
    categories: CategoryModel[],
    transactions: TransactionModel[],
    budgets: BudgetModel[],
    serverTime: string,
  ): SyncPullModel {
    return new SyncPullModel({
      accounts,
      categories,
      transactions,
      budgets,
      serverTime,
    });
  }
}
