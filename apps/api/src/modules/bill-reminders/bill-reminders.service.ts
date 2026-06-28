import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillReminder } from './bill-reminder.entity';
import { CreateBillReminderDto } from './dtos/create-bill-reminder.dto';
import { UpdateBillReminderDto } from './dtos/update-bill-reminder.dto';
import { BillReminderModel } from './models/bill-reminder.model';

@Injectable()
export class BillRemindersService {
  constructor(
    @InjectRepository(BillReminder)
    private readonly billRemindersRepo: Repository<BillReminder>,
  ) {}

  private async findEntityByUser(id: string, userId: string): Promise<BillReminder> {
    const reminder = await this.billRemindersRepo.findOne({ where: { id, user_id: userId } });
    if (!reminder) throw new NotFoundException('Bill reminder not found');
    return reminder;
  }

  async findAllByUser(userId: string): Promise<BillReminderModel[]> {
    const reminders = await this.billRemindersRepo.find({
      where: { user_id: userId },
      order: { due_day: 'ASC' },
    });
    return reminders.map((entity) => BillReminderModel.fromEntity(entity));
  }

  async findOneByUser(id: string, userId: string): Promise<BillReminderModel> {
    const reminder = await this.findEntityByUser(id, userId);
    return BillReminderModel.fromEntity(reminder);
  }

  async create(userId: string, data: CreateBillReminderDto): Promise<BillReminderModel> {
    const reminder = this.billRemindersRepo.create({ ...data, user_id: userId });
    const saved = await this.billRemindersRepo.save(reminder);
    return BillReminderModel.fromEntity(saved);
  }

  async update(id: string, userId: string, data: UpdateBillReminderDto): Promise<BillReminderModel> {
    const reminder = await this.findEntityByUser(id, userId);
    this.billRemindersRepo.merge(reminder, data);
    const saved = await this.billRemindersRepo.save(reminder);
    return BillReminderModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const reminder = await this.findEntityByUser(id, userId);
    await this.billRemindersRepo.remove(reminder);
  }
}
