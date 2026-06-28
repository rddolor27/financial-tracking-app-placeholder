import { Inject, type Provider } from '@nestjs/common';
import { STATEMENTS_SERVICE } from './statements.constants';
import { StatementsService } from './statements.service';

export const InjectStatementsService = (): PropertyDecorator &
  ParameterDecorator => Inject(STATEMENTS_SERVICE);

export const StatementsProvider: Provider = {
  provide: STATEMENTS_SERVICE,
  useClass: StatementsService,
};
