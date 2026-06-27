import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillReminder } from './bill-reminder.entity';
import { BillRemindersService } from './bill-reminders.service';
import { BillRemindersCronService } from './bill-reminders-cron.service';
import { BillRemindersController } from './bill-reminders.controller';
import { Notification } from '../notifications/notification.entity';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillReminder, Notification, Transaction])],
  controllers: [BillRemindersController],
  providers: [BillRemindersService, BillRemindersCronService],
  exports: [BillRemindersService],
})
export class BillRemindersModule {}
