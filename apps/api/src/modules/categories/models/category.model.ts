import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Category } from '../category.entity';

export class CategoryModel {
  public readonly id?: string;
  public readonly user_id?: string | null;
  public readonly name: string;
  public readonly type: 'expense' | 'income';
  public readonly icon?: string;
  public readonly color?: string;
  public readonly is_default?: boolean;
  public readonly is_hidden?: boolean;
  public readonly parent_id?: string | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string | null;
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    is_default?: boolean;
    is_hidden?: boolean;
    parent_id?: string | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.type = data.type;
    this.icon = data.icon;
    this.color = data.color;
    this.is_default = data.is_default;
    this.is_hidden = data.is_hidden;
    this.parent_id = data.parent_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateCategoryDto): CategoryModel {
    return new CategoryModel({
      name: dto.name,
      type: dto.type,
      icon: dto.icon,
      color: dto.color,
      parent_id: dto.parent_id ?? null,
    });
  }

  static fromUpdateDTO(dto: UpdateCategoryDto): CategoryModel {
    return new CategoryModel({
      name: dto.name ?? '',
      type: dto.type ?? 'expense',
      icon: dto.icon,
      color: dto.color,
      parent_id: dto.parent_id,
    });
  }

  static fromEntity(entity: Category): CategoryModel {
    return new CategoryModel({
      id: entity.id,
      user_id: entity.user_id,
      name: entity.name,
      type: entity.type,
      icon: entity.icon,
      color: entity.color,
      is_default: entity.is_default,
      is_hidden: entity.is_hidden,
      parent_id: entity.parent_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
