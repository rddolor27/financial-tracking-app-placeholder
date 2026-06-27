import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExchangeRate } from './exchange-rate.entity';

@Injectable()
export class ExchangeRatesService {
  private readonly logger = new Logger(ExchangeRatesService.name);

  constructor(
    @InjectRepository(ExchangeRate) private readonly ratesRepo: Repository<ExchangeRate>,
  ) {}

  async getAll(): Promise<ExchangeRate[]> {
    return this.ratesRepo.find();
  }

  async getRate(baseCurrency: string, targetCurrency: string): Promise<number | null> {
    if (baseCurrency === targetCurrency) return 1;

    const rate = await this.ratesRepo.findOne({
      where: { base_currency: baseCurrency, target_currency: targetCurrency },
    });

    return rate ? Number(rate.rate) : null;
  }

  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number | null> {
    const rate = await this.getRate(fromCurrency, toCurrency);
    if (rate === null) return null;
    return Math.round(amount * rate * 100) / 100;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async fetchRates() {
    this.logger.log('Fetching exchange rates...');

    try {
      // Uses a free exchange rate API (no key required for basic usage)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/PHP');
      if (!response.ok) {
        this.logger.error(`Failed to fetch rates: ${response.statusText}`);
        return;
      }

      const data = (await response.json()) as { rates: Record<string, number> };
      const rates = data.rates;
      const now = new Date();
      let updated = 0;

      for (const [currency, rate] of Object.entries(rates)) {
        if (currency === 'PHP') continue;

        await this.ratesRepo.upsert(
          {
            base_currency: 'PHP',
            target_currency: currency,
            rate: rate,
            fetched_at: now,
          },
          ['base_currency', 'target_currency'],
        );
        updated++;
      }

      this.logger.log(`Updated ${updated} exchange rates`);
    } catch (err) {
      this.logger.error('Failed to fetch exchange rates', err);
    }
  }
}
