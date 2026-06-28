import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { Transaction } from '../transaction.entity';

export class TransactionModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly account_id: string;
  public readonly category_id: string;
  public readonly type: 'income' | 'expense' | 'transfer';
  public readonly amount: number;
  public readonly description?: string | null;
  public readonly date: string;
  public readonly transfer_to_account_id?: string | null;
  public readonly image_url?: string | null;
  public readonly latitude?: number | null;
  public readonly longitude?: number | null;
  public readonly location_name?: string | null;
  public readonly is_recurring: boolean;
  public readonly recurring_interval?:
    | 'daily'
    | 'weekly'
    | 'biweekly'
    | 'monthly'
    | 'yearly'
    | null;
  public readonly recurring_next_date?: string | null;
  public readonly tags: string[];
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    account_id: string;
    category_id: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description?: string | null;
    date: string;
    transfer_to_account_id?: string | null;
    image_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    location_name?: string | null;
    is_recurring: boolean;
    recurring_interval?:
      | 'daily'
      | 'weekly'
      | 'biweekly'
      | 'monthly'
      | 'yearly'
      | null;
    recurring_next_date?: string | null;
    tags: string[];
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.account_id = data.account_id;
    this.category_id = data.category_id;
    this.type = data.type;
    this.amount = data.amount;
    this.description = data.description;
    this.date = data.date;
    this.transfer_to_account_id = data.transfer_to_account_id;
    this.image_url = data.image_url;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.location_name = data.location_name;
    this.is_recurring = data.is_recurring;
    this.recurring_interval = data.recurring_interval;
    this.recurring_next_date = data.recurring_next_date;
    this.tags = data.tags;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateTransactionDto): TransactionModel {
    return new TransactionModel({
      account_id: dto.account_id,
      category_id: dto.category_id,
      type: dto.type,
      amount: dto.amount,
      description: dto.description ?? null,
      date: dto.date,
      transfer_to_account_id: dto.transfer_to_account_id ?? null,
      image_url: dto.image_url ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      location_name: dto.location_name ?? null,
      is_recurring: dto.is_recurring,
      recurring_interval: dto.recurring_interval ?? null,
      tags: dto.tags,
    });
  }

  static fromUpdateDTO(dto: UpdateTransactionDto): TransactionModel {
    return new TransactionModel({
      account_id: dto.account_id ?? '',
      category_id: dto.category_id ?? '',
      type: dto.type ?? 'expense',
      amount: dto.amount ?? 0,
      description: dto.description,
      date: dto.date ?? '',
      transfer_to_account_id: dto.transfer_to_account_id,
      image_url: dto.image_url,
      latitude: dto.latitude,
      longitude: dto.longitude,
      location_name: dto.location_name,
      is_recurring: dto.is_recurring ?? false,
      recurring_interval: dto.recurring_interval,
      tags: dto.tags ?? [],
    });
  }

  static fromEntity(entity: Transaction): TransactionModel {
    return new TransactionModel({
      id: entity.id,
      user_id: entity.user_id,
      account_id: entity.account_id,
      category_id: entity.category_id,
      type: entity.type,
      amount: entity.amount,
      description: entity.description,
      date: entity.date,
      transfer_to_account_id: entity.transfer_to_account_id,
      image_url: entity.image_url,
      latitude: entity.latitude,
      longitude: entity.longitude,
      location_name: entity.location_name,
      is_recurring: entity.is_recurring,
      recurring_interval: entity.recurring_interval,
      recurring_next_date: entity.recurring_next_date,
      tags: entity.tags,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
