import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRatesController } from './exchange-rates.controller';
import { ExchangeRatesProvider } from './exchange-rates.service';
import { EXCHANGE_RATES_SERVICE } from './exchange-rates.constants';
import { ExchangeRate } from './exchange-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesProvider],
  exports: [EXCHANGE_RATES_SERVICE],
})
export class ExchangeRatesModule {}
