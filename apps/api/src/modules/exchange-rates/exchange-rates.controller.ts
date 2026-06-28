import { Controller, Get, Query } from '@nestjs/common';
import type { ExchangeRatesService } from './exchange-rates.service';
import { InjectExchangeRatesService } from './exchange-rates.providers';

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(
    @InjectExchangeRatesService() private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  @Get()
  async getAll() {
    return this.exchangeRatesService.getAll();
  }

  @Get('convert')
  async convert(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const converted = await this.exchangeRatesService.convert(parseFloat(amount), from, to);
    return { amount: parseFloat(amount), from, to, converted };
  }
}
