import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { TransactionsService } from './transactions.service';
import { InjectTransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { TransactionModel } from './models/transaction.model';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    @InjectTransactionsService() private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: { user: { id: string } },
    @Query('account_id') accountId?: string,
    @Query('category_id') categoryId?: string,
    @Query('type') type?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.transactionsService.findAllByUser(req.user.id, {
      accountId,
      categoryId,
      type,
      startDate,
      endDate,
      search,
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<TransactionModel> {
    return this.transactionsService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body()
    body: CreateTransactionDto,
  ): Promise<TransactionModel> {
    return this.transactionsService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body()
    body: UpdateTransactionDto,
  ): Promise<TransactionModel> {
    return this.transactionsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<void> {
    await this.transactionsService.remove(id, req.user.id);
  }
}
