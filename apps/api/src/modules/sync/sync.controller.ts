import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import type { SyncService } from './sync.service';
import { InjectSyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SyncPushDto } from './dtos/sync-push.dto';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(
    @InjectSyncService() private readonly syncService: SyncService,
  ) {}

  @Get('pull')
  async pull(@Req() req: { user: { id: string } }, @Query('lastSyncedAt') lastSyncedAt?: string) {
    return this.syncService.pull(req.user.id, lastSyncedAt);
  }

  @Post('push')
  async push(
    @Req() req: { user: { id: string } },
    @Body() body: SyncPushDto,
  ) {
    return this.syncService.push(req.user.id, body.changes as any);
  }
}
