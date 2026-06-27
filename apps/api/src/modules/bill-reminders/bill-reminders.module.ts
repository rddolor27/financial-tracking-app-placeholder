import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillReminder } from './bill-reminder.entity';
import { BillRemindersService } from './bill-reminders.service';
import { BillRemindersController } from './bill-reminders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BillReminder])],
  controllers: [BillRemindersController],
  providers: [BillRemindersService],
  exports: [BillRemindersService],
})
export class BillRemindersModule {}
