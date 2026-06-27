import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
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
import { SyncModule } from './modules/sync/sync.module';
import { ImportModule } from './modules/import/import.module';
import { InsightsModule } from './modules/insights/insights.module';
import { ExchangeRatesModule } from './modules/exchange-rates/exchange-rates.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ExportModule } from './modules/export/export.module';

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
    ScheduleModule.forRoot(),
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
    SyncModule,
    ImportModule,
    InsightsModule,
    ExchangeRatesModule,
    SubscriptionsModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
