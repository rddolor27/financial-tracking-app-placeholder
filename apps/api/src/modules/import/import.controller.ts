import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { ImportService } from './import.service';
import { InjectImportService } from './import.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CsvPreviewDto } from './dtos/csv-preview.dto';
import { CsvConfirmDto } from './dtos/csv-confirm.dto';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(
    @InjectImportService() private readonly importService: ImportService,
  ) {}

  @Post('csv/preview')
  async preview(
    @Req() req: { user: { id: string } },
    @Body() body: CsvPreviewDto,
  ) {
    return this.importService.preview(req.user.id, body.account_id, body.csv_content);
  }

  @Post('csv/confirm')
  async confirm(
    @Req() req: { user: { id: string } },
    @Body() body: CsvConfirmDto,
  ) {
    return this.importService.confirm(req.user.id, body.account_id, body.rows as any, body.default_category_id);
  }
}
