import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillReminder } from './bill-reminder.entity';
import { BillRemindersController } from './bill-reminders.controller';
import { BillRemindersProvider, BillRemindersCronProvider } from './bill-reminders.providers';
import { BILL_REMINDERS_SERVICE } from './bill-reminders.constants';
import { Notification } from '../notifications/notification.entity';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillReminder, Notification, Transaction])],
  controllers: [BillRemindersController],
  providers: [BillRemindersProvider, BillRemindersCronProvider],
  exports: [BILL_REMINDERS_SERVICE],
})
export class BillRemindersModule {}
