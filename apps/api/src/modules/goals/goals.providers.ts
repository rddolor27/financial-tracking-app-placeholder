import { Inject, type Provider } from '@nestjs/common';
import { GOALS_SERVICE } from './goals.constants';
import { GoalsService } from './goals.service';

export const InjectGoalsService = (): PropertyDecorator &
  ParameterDecorator => Inject(GOALS_SERVICE);

export const GoalsProvider: Provider = {
  provide: GOALS_SERVICE,
  useClass: GoalsService,
};
