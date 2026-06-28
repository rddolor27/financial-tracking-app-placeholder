import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import type { InsightsService } from './insights.service';
import { InjectInsightsService } from './insights.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InsightsQueryDto } from './dtos/insights-query.dto';

@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(
    @InjectInsightsService() private readonly insightsService: InsightsService,
  ) {}

  @Get('spending-by-category')
  async spendingByCategory(
    @Req() req: { user: { id: string } },
    @Query() query: InsightsQueryDto,
  ) {
    return this.insightsService.spendingByCategory(req.user.id, query.start_date, query.end_date);
  }

  @Get('income-vs-expense')
  async incomeVsExpense(
    @Req() req: { user: { id: string } },
    @Query() query: InsightsQueryDto,
  ) {
    return this.insightsService.incomeVsExpense(req.user.id, query.start_date, query.end_date);
  }

  @Get('trends')
  async trends(
    @Req() req: { user: { id: string } },
    @Query() query: InsightsQueryDto,
  ) {
    return this.insightsService.trends(req.user.id, query.start_date, query.end_date);
  }

  @Get('savings-rate')
  async savingsRate(
    @Req() req: { user: { id: string } },
    @Query() query: InsightsQueryDto,
  ) {
    return this.insightsService.savingsRate(req.user.id, query.start_date, query.end_date);
  }
}
