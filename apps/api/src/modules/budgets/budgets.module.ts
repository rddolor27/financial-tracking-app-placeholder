import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './budget.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsProvider } from './budgets.service';
import { BUDGETS_SERVICE } from './budgets.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Budget])],
  controllers: [BudgetsController],
  providers: [BudgetsProvider],
  exports: [BUDGETS_SERVICE],
})
export class BudgetsModule {}
