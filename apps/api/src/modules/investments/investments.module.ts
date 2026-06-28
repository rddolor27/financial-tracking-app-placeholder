import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './investment.entity';
import { InvestmentTransaction } from './investment-transaction.entity';
import { InvestmentsController } from './investments.controller';
import { InvestmentsProvider } from './investments.providers';
import { INVESTMENTS_SERVICE } from './investments.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, InvestmentTransaction])],
  controllers: [InvestmentsController],
  providers: [InvestmentsProvider],
  exports: [INVESTMENTS_SERVICE],
})
export class InvestmentsModule {}
