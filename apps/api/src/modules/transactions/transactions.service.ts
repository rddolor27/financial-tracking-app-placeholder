import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly accountsService: AccountsService,
  ) {}

  async findAllByUser(
    userId: string,
    options?: {
      accountId?: string;
      categoryId?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      cursor?: string;
      limit?: number;
    },
  ) {
    const qb = this.txRepo
      .createQueryBuilder('tx')
      .where('tx.user_id = :userId', { userId })
      .orderBy('tx.date', 'DESC')
      .addOrderBy('tx.created_at', 'DESC');

    if (options?.accountId) {
      qb.andWhere('tx.account_id = :accountId', {
        accountId: options.accountId,
      });
    }
    if (options?.categoryId) {
      qb.andWhere('tx.category_id = :categoryId', {
        categoryId: options.categoryId,
      });
    }
    if (options?.type) {
      qb.andWhere('tx.type = :type', { type: options.type });
    }
    if (options?.startDate) {
      qb.andWhere('tx.date >= :startDate', { startDate: options.startDate });
    }
    if (options?.endDate) {
      qb.andWhere('tx.date <= :endDate', { endDate: options.endDate });
    }
    if (options?.search) {
      qb.andWhere(
        `(to_tsvector('english', COALESCE(tx.description, '') || ' ' || array_to_string(tx.tags, ' ')) @@ plainto_tsquery('english', :search))`,
        { search: options.search },
      );
    }
    if (options?.cursor) {
      qb.andWhere('tx.id < :cursor', { cursor: options.cursor });
    }

    const limit = options?.limit || 20;
    qb.take(limit + 1);

    const results = await qb.getMany();
    const hasNextPage = results.length > limit;
    const data = hasNextPage ? results.slice(0, limit) : results;

    return {
      data,
      meta: {
        hasNextPage,
        nextCursor: hasNextPage ? data[data.length - 1]?.id : null,
      },
    };
  }

  async findOneByUser(id: string, userId: string): Promise<Transaction> {
    const tx = await this.txRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }
    return tx;
  }

  async create(
    userId: string,
    data: Partial<Transaction>,
  ): Promise<Transaction> {
    const account = await this.accountsService.findOneByUser(
      data.account_id!,
      userId,
    );

    const tx = this.txRepo.create({ ...data, user_id: userId });
    const saved = await this.txRepo.save(tx);

    // Update account balance
    const balanceChange =
      data.type === 'income' ? Number(data.amount) : -Number(data.amount);
    await this.accountsService.update(account.id, userId, {
      balance: Number(account.balance) + balanceChange,
    });

    // Handle transfer
    if (data.type === 'transfer' && data.transfer_to_account_id) {
      await this.accountsService.update(
        data.transfer_to_account_id,
        userId,
        {
          balance:
            (
              await this.accountsService.findOneByUser(
                data.transfer_to_account_id,
                userId,
              )
            ).balance + Number(data.amount),
        },
      );
    }

    return saved;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Transaction>,
  ): Promise<Transaction> {
    const tx = await this.findOneByUser(id, userId);
    this.txRepo.merge(tx, data);
    return this.txRepo.save(tx);
  }

  async remove(id: string, userId: string): Promise<void> {
    const tx = await this.findOneByUser(id, userId);
    const account = await this.accountsService.findOneByUser(
      tx.account_id,
      userId,
    );

    // Reverse the balance change
    const reversal =
      tx.type === 'income' ? -Number(tx.amount) : Number(tx.amount);
    await this.accountsService.update(account.id, userId, {
      balance: Number(account.balance) + reversal,
    });

    await this.txRepo.remove(tx);
  }
}
