import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BillReminder } from './bill-reminder.entity';
import { Notification } from '../notifications/notification.entity';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class BillRemindersCronService {
  private readonly logger = new Logger(BillRemindersCronService.name);

  constructor(
    @InjectRepository(BillReminder) private readonly billsRepo: Repository<BillReminder>,
    @InjectRepository(Notification) private readonly notificationsRepo: Repository<Notification>,
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkUpcomingBills() {
    this.logger.log('Checking upcoming bill reminders...');

    const activeBills = await this.billsRepo.find({
      where: { is_active: true },
    });

    const today = new Date();
    const currentDay = today.getDate();
    let notified = 0;
    let autoCreated = 0;

    for (const bill of activeBills) {
      const daysUntilDue = this.getDaysUntilDue(currentDay, bill.due_day);

      // Send reminder notification
      if (daysUntilDue <= bill.reminder_days_before && daysUntilDue >= 0) {
        await this.notificationsRepo.save(
          this.notificationsRepo.create({
            user_id: bill.user_id,
            type: 'bill_reminder' as const,
            title: `Bill Due${daysUntilDue === 0 ? ' Today' : ' Soon'}`,
            message: `${bill.name}: ${bill.currency} ${Number(bill.amount).toFixed(2)} is due${
              daysUntilDue === 0 ? ' today' : ` in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`
            }.`,
            is_read: false,
          }),
        );
        notified++;
      }

      // Auto-create transaction on due day
      if (daysUntilDue === 0 && bill.auto_create_transaction && bill.account_id && bill.category_id) {
        const todayStr = today.toISOString().split('T')[0];

        // Skip if already paid this period
        if (bill.last_paid_date === todayStr) continue;

        await this.transactionsRepo.save(
          this.transactionsRepo.create({
            user_id: bill.user_id,
            account_id: bill.account_id,
            category_id: bill.category_id,
            type: 'expense' as const,
            amount: bill.amount,
            description: `Auto-payment: ${bill.name}`,
            date: todayStr,
            is_recurring: false,
            tags: ['bill-auto'],
          }),
        );

        await this.billsRepo.update(bill.id, { last_paid_date: todayStr });
        autoCreated++;
      }
    }

    this.logger.log(`Processed bills: ${notified} notified, ${autoCreated} auto-created`);
  }

  private getDaysUntilDue(currentDay: number, dueDay: number): number {
    if (dueDay >= currentDay) {
      return dueDay - currentDay;
    }
    // Due day has passed this month — not due yet for next check
    return -1;
  }
}
