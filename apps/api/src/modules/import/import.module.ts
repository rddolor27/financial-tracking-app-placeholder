import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { ImportProvider } from './import.providers';
import { Transaction } from '../transactions/transaction.entity';
import { Account } from '../accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [ImportController],
  providers: [ImportProvider],
})
export class ImportModule {}
