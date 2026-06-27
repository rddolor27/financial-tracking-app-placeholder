import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { Account } from '../accounts/account.entity';
import { Category } from '../categories/category.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Budget } from '../budgets/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Category, Transaction, Budget])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
