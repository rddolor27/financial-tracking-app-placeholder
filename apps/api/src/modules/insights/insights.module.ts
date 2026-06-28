import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsController } from './insights.controller';
import { InsightsProvider } from './insights.providers';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [InsightsController],
  providers: [InsightsProvider],
})
export class InsightsModule {}
