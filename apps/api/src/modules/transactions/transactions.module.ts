import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsProvider } from './transactions.service';
import { RecurringProvider } from './recurring.service';
import { TRANSACTIONS_SERVICE } from './transactions.constants';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AccountsModule],
  controllers: [TransactionsController],
  providers: [TransactionsProvider, RecurringProvider],
  exports: [TRANSACTIONS_SERVICE],
})
export class TransactionsModule {}
