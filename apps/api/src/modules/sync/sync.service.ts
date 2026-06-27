import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Category } from '../categories/category.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Budget } from '../budgets/budget.entity';

export interface SyncPullResult {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  serverTime: string;
}

interface SyncPushItem {
  entity_type: string;
  action: 'create' | 'update' | 'delete';
  entity_id?: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Account) private readonly accountsRepo: Repository<Account>,
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
    @InjectRepository(Budget) private readonly budgetsRepo: Repository<Budget>,
  ) {}

  async pull(userId: string, lastSyncedAt?: string): Promise<SyncPullResult> {
    const since = lastSyncedAt ? new Date(lastSyncedAt) : new Date(0);
    const whereBase = { user_id: userId, updated_at: MoreThan(since) };

    const [accounts, categories, transactions, budgets] = await Promise.all([
      this.accountsRepo.find({ where: whereBase }),
      this.categoriesRepo.find({ where: [{ user_id: userId, updated_at: MoreThan(since) }] }),
      this.transactionsRepo.find({ where: whereBase }),
      this.budgetsRepo.find({ where: whereBase }),
    ]);

    return {
      accounts,
      categories,
      transactions,
      budgets,
      serverTime: new Date().toISOString(),
    };
  }

  async push(userId: string, changes: SyncPushItem[]): Promise<{ processed: number; conflicts: string[] }> {
    const conflicts: string[] = [];
    let processed = 0;

    for (const change of changes) {
      try {
        await this.processChange(userId, change);
        processed++;
      } catch {
        conflicts.push(`${change.entity_type}:${change.entity_id || 'new'}`);
      }
    }

    return { processed, conflicts };
  }

  private async processChange(userId: string, change: SyncPushItem): Promise<void> {
    const repo = this.getRepo(change.entity_type);
    if (!repo) return;

    switch (change.action) {
      case 'create': {
        const entity = repo.create({ ...change.data, user_id: userId } as Record<string, unknown>);
        await repo.save(entity);
        break;
      }
      case 'update': {
        if (!change.entity_id) break;
        const existing = await repo.findOne({ where: { id: change.entity_id, user_id: userId } as Record<string, unknown> });
        if (!existing) throw new Error('Not found');
        Object.assign(existing, change.data);
        await repo.save(existing);
        break;
      }
      case 'delete': {
        if (!change.entity_id) break;
        const toDelete = await repo.findOne({ where: { id: change.entity_id, user_id: userId } as Record<string, unknown> });
        if (toDelete) await repo.remove(toDelete);
        break;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getRepo(entityType: string): Repository<any> | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: Record<string, Repository<any>> = {
      account: this.accountsRepo,
      category: this.categoriesRepo,
      transaction: this.transactionsRepo,
      budget: this.budgetsRepo,
    };
    return map[entityType] || null;
  }
}
