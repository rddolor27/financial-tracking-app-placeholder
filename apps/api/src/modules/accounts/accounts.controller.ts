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
import { InjectAccountsService } from './accounts.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  type CreateAccountDto,
  CreateAccountSchema,
  type UpdateAccountDto,
  UpdateAccountSchema,
} from './dtos';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
    @InjectAccountsService() private readonly accountsService: AccountsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.accountsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.accountsService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(CreateAccountSchema)) body: CreateAccountDto,
  ) {
    return this.accountsService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(UpdateAccountSchema)) body: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    await this.accountsService.remove(id, req.user.id);
  }
}
