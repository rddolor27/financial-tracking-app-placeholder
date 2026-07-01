import { Inject, Injectable, Logger, type Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Transaction } from './transaction.entity';
import { RECURRING_SERVICE } from './transactions.constants';

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processRecurringTransactions() {
    this.logger.log('Processing recurring transactions...');
    const today = new Date().toISOString().split('T')[0];

    const dueTransactions = await this.transactionsRepo.find({
      where: {
        is_recurring: true,
        recurring_next_date: LessThanOrEqual(today),
      },
    });

    let created = 0;
    for (const template of dueTransactions) {
      try {
        const newTransaction = this.transactionsRepo.create({
          user_id: template.user_id,
          account_id: template.account_id,
          category_id: template.category_id,
          type: template.type,
          amount: template.amount,
          description: template.description,
          date: today,
          tags: template.tags,
        });
        await this.transactionsRepo.save(newTransaction);

        template.recurring_next_date = this.calculateNextDate(today, template.recurring_interval);
        await this.transactionsRepo.save(template);
        created++;
      } catch (err) {
        this.logger.error(`Failed to process recurring transaction ${template.id}`, err);
      }
    }

    this.logger.log(`Created ${created} recurring transactions`);
    return created;
  }

  private calculateNextDate(currentDate: string, interval: string | null): string {
    const date = new Date(currentDate);
    switch (interval) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split('T')[0];
  }
}

export const InjectRecurringService = (): PropertyDecorator &
  ParameterDecorator => Inject(RECURRING_SERVICE);

export const RecurringProvider: Provider = {
  provide: RECURRING_SERVICE,
  useClass: RecurringService,
};
