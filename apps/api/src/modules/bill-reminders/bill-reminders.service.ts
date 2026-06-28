import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillReminder } from './bill-reminder.entity';
import type { CreateBillReminderDto, UpdateBillReminderDto } from './dtos';

@Injectable()
export class BillRemindersService {
  constructor(
    @InjectRepository(BillReminder)
    private readonly billRemindersRepo: Repository<BillReminder>,
  ) {}

  async findAllByUser(userId: string): Promise<BillReminder[]> {
    return this.billRemindersRepo.find({
      where: { user_id: userId },
      order: { due_day: 'ASC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<BillReminder> {
    const reminder = await this.billRemindersRepo.findOne({ where: { id, user_id: userId } });
    if (!reminder) throw new NotFoundException('Bill reminder not found');
    return reminder;
  }

  async create(userId: string, data: CreateBillReminderDto): Promise<BillReminder> {
    const reminder = this.billRemindersRepo.create({ ...data, user_id: userId });
    return this.billRemindersRepo.save(reminder);
  }

  async update(id: string, userId: string, data: UpdateBillReminderDto): Promise<BillReminder> {
    const reminder = await this.findOneByUser(id, userId);
    this.billRemindersRepo.merge(reminder, data);
    return this.billRemindersRepo.save(reminder);
  }

  async remove(id: string, userId: string): Promise<void> {
    const reminder = await this.findOneByUser(id, userId);
    await this.billRemindersRepo.remove(reminder);
  }
}
