import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('spending-by-category')
  async spendingByCategory(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.insightsService.spendingByCategory(req.user.id, startDate, endDate);
  }

  @Get('income-vs-expense')
  async incomeVsExpense(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.insightsService.incomeVsExpense(req.user.id, startDate, endDate);
  }

  @Get('trends')
  async trends(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.insightsService.trends(req.user.id, startDate, endDate);
  }

  @Get('savings-rate')
  async savingsRate(
    @Req() req: { user: { id: string } },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.insightsService.savingsRate(req.user.id, startDate, endDate);
  }
}
