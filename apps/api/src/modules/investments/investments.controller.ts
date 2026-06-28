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
import type { InvestmentsService } from './investments.service';
import { InjectInvestmentsService } from './investments.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { CreateInvestmentTransactionDto } from './dtos/create-investment-transaction.dto';
import { InvestmentModel } from './models/investment.model';
import { InvestmentTransactionModel } from './models/investment-transaction.model';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(
    @InjectInvestmentsService() private readonly investmentsService: InvestmentsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<InvestmentModel[]> {
    return this.investmentsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: { user: { id: string } }): Promise<InvestmentModel> {
    return this.investmentsService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() body: CreateInvestmentDto,
  ): Promise<InvestmentModel> {
    return this.investmentsService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body: UpdateInvestmentDto,
  ): Promise<InvestmentModel> {
    return this.investmentsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }): Promise<void> {
    await this.investmentsService.remove(id, req.user.id);
  }

  @Get(':id/transactions')
  async findTransactions(@Param('id') id: string, @Req() req: { user: { id: string } }): Promise<InvestmentTransactionModel[]> {
    return this.investmentsService.findTransactions(id, req.user.id);
  }

  @Post(':id/transactions')
  async createTransaction(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body: CreateInvestmentTransactionDto,
  ): Promise<InvestmentTransactionModel> {
    return this.investmentsService.createTransaction(req.user.id, {
      ...body,
      investment_id: id,
    });
  }
}
