import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('pull')
  async pull(@Req() req: { user: { id: string } }, @Query('lastSyncedAt') lastSyncedAt?: string) {
    return this.syncService.pull(req.user.id, lastSyncedAt);
  }

  @Post('push')
  async push(
    @Req() req: { user: { id: string } },
    @Body() body: { changes: Array<{ entity_type: string; action: 'create' | 'update' | 'delete'; entity_id?: string; data?: Record<string, unknown> }> },
  ) {
    return this.syncService.push(req.user.id, body.changes);
  }
}
