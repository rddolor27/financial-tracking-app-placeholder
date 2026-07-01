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
import type { AccountsService } from './accounts.service';
import { InjectAccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { AccountModel } from './models/account.model';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
    @InjectAccountsService() private readonly accountsService: AccountsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<AccountModel[]> {
    return this.accountsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<AccountModel> {
    return this.accountsService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() body: CreateAccountDto,
  ): Promise<AccountModel> {
    return this.accountsService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body: UpdateAccountDto,
  ): Promise<AccountModel> {
    return this.accountsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<void> {
    await this.accountsService.remove(id, req.user.id);
  }
}
