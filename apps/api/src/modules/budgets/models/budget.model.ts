import { CreateBudgetDto } from '../dtos/create-budget.dto';
import { UpdateBudgetDto } from '../dtos/update-budget.dto';
import { Budget } from '../budget.entity';

export class BudgetModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly category_id: string;
  public readonly amount: number;
  public readonly period: 'weekly' | 'monthly' | 'yearly';
  public readonly start_date: string;
  public readonly end_date?: string | null;
  public readonly alert_threshold: number;
  public readonly is_active?: boolean;
  public readonly spent?: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    category_id: string;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    start_date: string;
    end_date?: string | null;
    alert_threshold: number;
    is_active?: boolean;
    spent?: number;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.category_id = data.category_id;
    this.amount = data.amount;
    this.period = data.period;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.alert_threshold = data.alert_threshold;
    this.is_active = data.is_active;
    this.spent = data.spent;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateBudgetDto): BudgetModel {
    return new BudgetModel({
      category_id: dto.category_id,
      amount: dto.amount,
      period: dto.period,
      start_date: dto.start_date,
      end_date: dto.end_date ?? null,
      alert_threshold: dto.alert_threshold,
    });
  }

  static fromUpdateDTO(dto: UpdateBudgetDto): BudgetModel {
    return new BudgetModel({
      category_id: dto.category_id ?? '',
      amount: dto.amount ?? 0,
      period: dto.period ?? 'monthly',
      start_date: dto.start_date ?? '',
      end_date: dto.end_date,
      alert_threshold: dto.alert_threshold ?? 80,
    });
  }

  static fromEntity(entity: Budget): BudgetModel {
    return new BudgetModel({
      id: entity.id,
      user_id: entity.user_id,
      category_id: entity.category_id,
      amount: entity.amount,
      period: entity.period,
      start_date: entity.start_date,
      end_date: entity.end_date,
      alert_threshold: entity.alert_threshold,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
