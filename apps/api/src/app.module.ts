import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { GoalsModule } from './modules/goals/goals.module';
import { BillRemindersModule } from './modules/bill-reminders/bill-reminders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StatementsModule } from './modules/statements/statements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    AuthModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    InvestmentsModule,
    GoalsModule,
    BillRemindersModule,
    NotificationsModule,
    StatementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
