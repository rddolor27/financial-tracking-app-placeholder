import { CreateGoalDto } from '../dtos/create-goal.dto';
import { UpdateGoalDto } from '../dtos/update-goal.dto';
import { Goal } from '../goal.entity';

export class GoalModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly name: string;
  public readonly target_amount: number;
  public readonly current_amount: number;
  public readonly currency: string;
  public readonly target_date?: string | null;
  public readonly icon?: string;
  public readonly color?: string;
  public readonly is_completed?: boolean;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    name: string;
    target_amount: number;
    current_amount: number;
    currency: string;
    target_date?: string | null;
    icon?: string;
    color?: string;
    is_completed?: boolean;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.target_amount = data.target_amount;
    this.current_amount = data.current_amount;
    this.currency = data.currency;
    this.target_date = data.target_date;
    this.icon = data.icon;
    this.color = data.color;
    this.is_completed = data.is_completed;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateGoalDto): GoalModel {
    return new GoalModel({
      name: dto.name,
      target_amount: dto.target_amount,
      current_amount: 0,
      currency: dto.currency ?? 'PHP',
      target_date: dto.target_date ?? null,
      icon: dto.icon,
      color: dto.color,
    });
  }

  static fromUpdateDTO(dto: UpdateGoalDto): GoalModel {
    return new GoalModel({
      name: dto.name ?? '',
      target_amount: dto.target_amount ?? 0,
      current_amount: 0,
      currency: dto.currency ?? 'PHP',
      target_date: dto.target_date,
      icon: dto.icon,
      color: dto.color,
    });
  }

  static fromEntity(entity: Goal): GoalModel {
    return new GoalModel({
      id: entity.id,
      user_id: entity.user_id,
      name: entity.name,
      target_amount: entity.target_amount,
      current_amount: entity.current_amount,
      currency: entity.currency,
      target_date: entity.target_date,
      icon: entity.icon,
      color: entity.color,
      is_completed: entity.is_completed,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
