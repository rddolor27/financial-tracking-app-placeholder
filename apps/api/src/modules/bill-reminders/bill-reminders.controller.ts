import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { BillRemindersService } from './bill-reminders.service';
import { InjectBillRemindersService } from './bill-reminders.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBillReminderDto } from './dtos/create-bill-reminder.dto';
import { UpdateBillReminderDto } from './dtos/update-bill-reminder.dto';
import { BillReminderModel } from './models/bill-reminder.model';

@Controller('bill-reminders')
@UseGuards(JwtAuthGuard)
export class BillRemindersController {
  constructor(
    @InjectBillRemindersService() private readonly billRemindersService: BillRemindersService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<BillReminderModel[]> {
    return this.billRemindersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: { user: { id: string } }): Promise<BillReminderModel> {
    return this.billRemindersService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() body: CreateBillReminderDto,
  ): Promise<BillReminderModel> {
    return this.billRemindersService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body: UpdateBillReminderDto,
  ): Promise<BillReminderModel> {
    return this.billRemindersService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }): Promise<void> {
    await this.billRemindersService.remove(id, req.user.id);
  }
}
