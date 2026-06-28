import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsProvider } from './accounts.providers';
import { ACCOUNTS_SERVICE } from './accounts.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountsController],
  providers: [AccountsProvider],
  exports: [ACCOUNTS_SERVICE],
})
export class AccountsModule {}
