import { Inject, type Provider } from '@nestjs/common';
import { SYNC_SERVICE } from './sync.constants';
import { SyncService } from './sync.service';

export const InjectSyncService = (): PropertyDecorator &
  ParameterDecorator => Inject(SYNC_SERVICE);

export const SyncProvider: Provider = {
  provide: SYNC_SERVICE,
  useClass: SyncService,
};
