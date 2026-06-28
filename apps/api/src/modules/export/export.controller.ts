import { Controller, Get, Query, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import type { ExportService } from './export.service';
import { InjectExportService } from './export.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(
    @InjectExportService() private readonly exportService: ExportService,
  ) {}

  @Get('csv')
  async exportCsv(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const csv = await this.exportService.exportCsv(req.user.id, startDate, endDate);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${startDate}_${endDate}.csv"`);
    res.send(csv);
  }

  @Get('excel')
  async exportExcel(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportExcel(req.user.id, startDate, endDate);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${startDate}_${endDate}.xlsx"`);
    res.send(buffer);
  }

  @Get('pdf')
  async exportPdf(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportPdf(req.user.id, startDate, endDate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${startDate}_${endDate}.pdf"`);
    res.send(buffer);
  }

  @Get('json')
  async exportJson(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.exportService.getExportData(req.user.id, startDate, endDate);
  }
}
