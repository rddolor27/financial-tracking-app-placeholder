import { Inject, type Provider } from '@nestjs/common';
import { CATEGORIES_SERVICE } from './categories.constants';
import { CategoriesService } from './categories.service';

export const InjectCategoriesService = (): PropertyDecorator &
  ParameterDecorator => Inject(CATEGORIES_SERVICE);

export const CategoriesProvider: Provider = {
  provide: CATEGORIES_SERVICE,
  useClass: CategoriesService,
};
