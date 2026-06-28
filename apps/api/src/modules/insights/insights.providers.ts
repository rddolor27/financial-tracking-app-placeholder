import { Inject, type Provider } from '@nestjs/common';
import { INSIGHTS_SERVICE } from './insights.constants';
import { InsightsService } from './insights.service';

export const InjectInsightsService = (): PropertyDecorator &
  ParameterDecorator => Inject(INSIGHTS_SERVICE);

export const InsightsProvider: Provider = {
  provide: INSIGHTS_SERVICE,
  useClass: InsightsService,
};
