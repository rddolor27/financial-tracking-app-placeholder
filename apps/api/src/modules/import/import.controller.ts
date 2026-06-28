import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { ImportService } from './import.service';
import { InjectImportService } from './import.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(
    @InjectImportService() private readonly importService: ImportService,
  ) {}

  @Post('csv/preview')
  async preview(
    @Req() req: { user: { id: string } },
    @Body() body: { account_id: string; csv_content: string },
  ) {
    return this.importService.preview(req.user.id, body.account_id, body.csv_content);
  }

  @Post('csv/confirm')
  async confirm(
    @Req() req: { user: { id: string } },
    @Body() body: {
      account_id: string;
      rows: Array<{ date: string; description: string; amount: string; type: string; category_id?: string }>;
      default_category_id: string;
    },
  ) {
    return this.importService.confirm(req.user.id, body.account_id, body.rows, body.default_category_id);
  }
}
