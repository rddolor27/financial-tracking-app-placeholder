import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { BillRemindersService } from './bill-reminders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateBillReminderSchema, UpdateBillReminderSchema,
} from '@financial-tracker/shared-types';

@Controller('bill-reminders')
@UseGuards(JwtAuthGuard)
export class BillRemindersController {
  constructor(private readonly billRemindersService: BillRemindersService) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.billRemindersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.billRemindersService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(CreateBillReminderSchema)) body: Record<string, unknown>,
  ) {
    return this.billRemindersService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(UpdateBillReminderSchema)) body: Record<string, unknown>,
  ) {
    return this.billRemindersService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    await this.billRemindersService.remove(id, req.user.id);
  }
}
