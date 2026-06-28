import { Controller, Get, Query, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import type { ExportService } from './export.service';
import { InjectExportService } from './export.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportQueryDto } from './dtos/export-query.dto';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(
    @InjectExportService() private readonly exportService: ExportService,
  ) {}

  @Get('csv')
  async exportCsv(
    @Req() req: { user: { id: string } },
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ) {
    const csv = await this.exportService.exportCsv(req.user.id, query.start_date!, query.end_date!);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${query.start_date}_${query.end_date}.csv"`);
    res.send(csv);
  }

  @Get('excel')
  async exportExcel(
    @Req() req: { user: { id: string } },
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportExcel(req.user.id, query.start_date!, query.end_date!);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${query.start_date}_${query.end_date}.xlsx"`);
    res.send(buffer);
  }

  @Get('pdf')
  async exportPdf(
    @Req() req: { user: { id: string } },
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportPdf(req.user.id, query.start_date!, query.end_date!);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${query.start_date}_${query.end_date}.pdf"`);
    res.send(buffer);
  }

  @Get('json')
  async exportJson(
    @Req() req: { user: { id: string } },
    @Query() query: ExportQueryDto,
  ) {
    return this.exportService.getExportData(req.user.id, query.start_date!, query.end_date!);
  }
}
