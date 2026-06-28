import { Inject, type Provider } from '@nestjs/common';
import { EXPORT_SERVICE } from './export.constants';
import { ExportService } from './export.service';

export const InjectExportService = (): PropertyDecorator &
  ParameterDecorator => Inject(EXPORT_SERVICE);

export const ExportProvider: Provider = {
  provide: EXPORT_SERVICE,
  useClass: ExportService,
};
