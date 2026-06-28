import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../user.entity';

export class UserModel {
  public readonly id?: string;
  public readonly email: string;
  public readonly first_name: string;
  public readonly last_name: string;
  public readonly avatar_url?: string | null;
  public readonly currency: string;
  public readonly auth_provider?: 'email' | 'google' | 'both';
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    currency: string;
    auth_provider?: 'email' | 'google' | 'both';
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.avatar_url = data.avatar_url;
    this.currency = data.currency;
    this.auth_provider = data.auth_provider;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromUpdateDTO(dto: UpdateUserDto): UserModel {
    return new UserModel({
      email: '',
      first_name: dto.first_name ?? '',
      last_name: dto.last_name ?? '',
      avatar_url: dto.avatar_url,
      currency: dto.currency ?? 'PHP',
    });
  }

  static fromEntity(entity: User): UserModel {
    return new UserModel({
      id: entity.id,
      email: entity.email,
      first_name: entity.first_name,
      last_name: entity.last_name,
      avatar_url: entity.avatar_url,
      currency: entity.currency,
      auth_provider: entity.auth_provider,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
