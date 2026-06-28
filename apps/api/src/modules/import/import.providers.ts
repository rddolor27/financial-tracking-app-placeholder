import { Inject, type Provider } from '@nestjs/common';
import { IMPORT_SERVICE } from './import.constants';
import { ImportService } from './import.service';

export const InjectImportService = (): PropertyDecorator &
  ParameterDecorator => Inject(IMPORT_SERVICE);

export const ImportProvider: Provider = {
  provide: IMPORT_SERVICE,
  useClass: ImportService,
};
