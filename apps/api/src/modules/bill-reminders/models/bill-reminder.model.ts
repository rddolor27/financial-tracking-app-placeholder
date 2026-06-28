import { CreateBillReminderDto } from '../dtos/create-bill-reminder.dto';
import { UpdateBillReminderDto } from '../dtos/update-bill-reminder.dto';
import { BillReminder } from '../bill-reminder.entity';

export class BillReminderModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly name: string;
  public readonly amount: number;
  public readonly currency: string;
  public readonly due_day: number;
  public readonly frequency: 'monthly' | 'quarterly' | 'yearly';
  public readonly category_id?: string | null;
  public readonly account_id?: string | null;
  public readonly reminder_days_before: number;
  public readonly auto_create_transaction: boolean;
  public readonly is_active?: boolean;
  public readonly last_paid_date?: string | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    name: string;
    amount: number;
    currency: string;
    due_day: number;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    category_id?: string | null;
    account_id?: string | null;
    reminder_days_before: number;
    auto_create_transaction: boolean;
    is_active?: boolean;
    last_paid_date?: string | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.amount = data.amount;
    this.currency = data.currency;
    this.due_day = data.due_day;
    this.frequency = data.frequency;
    this.category_id = data.category_id;
    this.account_id = data.account_id;
    this.reminder_days_before = data.reminder_days_before;
    this.auto_create_transaction = data.auto_create_transaction;
    this.is_active = data.is_active;
    this.last_paid_date = data.last_paid_date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateBillReminderDto): BillReminderModel {
    return new BillReminderModel({
      name: dto.name,
      amount: dto.amount,
      currency: dto.currency,
      due_day: dto.due_day,
      frequency: dto.frequency,
      category_id: dto.category_id ?? null,
      account_id: dto.account_id ?? null,
      reminder_days_before: dto.reminder_days_before,
      auto_create_transaction: dto.auto_create_transaction,
    });
  }

  static fromUpdateDTO(dto: UpdateBillReminderDto): BillReminderModel {
    return new BillReminderModel({
      name: dto.name ?? '',
      amount: dto.amount ?? 0,
      currency: dto.currency ?? 'PHP',
      due_day: dto.due_day ?? 1,
      frequency: dto.frequency ?? 'monthly',
      category_id: dto.category_id,
      account_id: dto.account_id,
      reminder_days_before: dto.reminder_days_before ?? 3,
      auto_create_transaction: dto.auto_create_transaction ?? false,
    });
  }

  static fromEntity(entity: BillReminder): BillReminderModel {
    return new BillReminderModel({
      id: entity.id,
      user_id: entity.user_id,
      name: entity.name,
      amount: entity.amount,
      currency: entity.currency,
      due_day: entity.due_day,
      frequency: entity.frequency,
      category_id: entity.category_id,
      account_id: entity.account_id,
      reminder_days_before: entity.reminder_days_before,
      auto_create_transaction: entity.auto_create_transaction,
      is_active: entity.is_active,
      last_paid_date: entity.last_paid_date,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
