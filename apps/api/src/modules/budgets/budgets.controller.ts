import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { BudgetsService } from './budgets.service';
import { InjectBudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBudgetDto } from './dtos/create-budget.dto';
import { UpdateBudgetDto } from './dtos/update-budget.dto';
import { BudgetModel } from './models/budget.model';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(
    @InjectBudgetsService() private readonly budgetsService: BudgetsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<BudgetModel[]> {
    return this.budgetsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<BudgetModel> {
    return this.budgetsService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() body: CreateBudgetDto,
  ): Promise<BudgetModel> {
    return this.budgetsService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body: UpdateBudgetDto,
  ): Promise<BudgetModel> {
    return this.budgetsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<void> {
    await this.budgetsService.remove(id, req.user.id);
  }
}
