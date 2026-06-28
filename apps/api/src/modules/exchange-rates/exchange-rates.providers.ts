import { Inject, type Provider } from '@nestjs/common';
import { EXCHANGE_RATES_SERVICE } from './exchange-rates.constants';
import { ExchangeRatesService } from './exchange-rates.service';

export const InjectExchangeRatesService = (): PropertyDecorator &
  ParameterDecorator => Inject(EXCHANGE_RATES_SERVICE);

export const ExchangeRatesProvider: Provider = {
  provide: EXCHANGE_RATES_SERVICE,
  useClass: ExchangeRatesService,
};
