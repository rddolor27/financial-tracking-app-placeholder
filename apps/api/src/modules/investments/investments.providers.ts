import { Inject, type Provider } from '@nestjs/common';
import { INVESTMENTS_SERVICE } from './investments.constants';
import { InvestmentsService } from './investments.service';

export const InjectInvestmentsService = (): PropertyDecorator &
  ParameterDecorator => Inject(INVESTMENTS_SERVICE);

export const InvestmentsProvider: Provider = {
  provide: INVESTMENTS_SERVICE,
  useClass: InvestmentsService,
};
