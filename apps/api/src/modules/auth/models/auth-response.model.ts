import { RegisterDto } from '../dtos/register.dto';
import { User } from '../../users/user.entity';

export class AuthUserModel {
  public readonly id?: string;
  public readonly email: string;
  public readonly first_name: string;
  public readonly last_name: string;
  public readonly avatar_url?: string | null;
  public readonly currency: string;

  private constructor(data: {
    id?: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    currency: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.avatar_url = data.avatar_url;
    this.currency = data.currency;
  }

  static fromRegisterDTO(dto: RegisterDto): AuthUserModel {
    return new AuthUserModel({
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      currency: dto.currency ?? 'PHP',
    });
  }

  static fromEntity(entity: User): AuthUserModel {
    return new AuthUserModel({
      id: entity.id,
      email: entity.email,
      first_name: entity.first_name,
      last_name: entity.last_name,
      avatar_url: entity.avatar_url,
      currency: entity.currency,
    });
  }
}

export class AuthResponseModel {
  public readonly access_token: string;
  public readonly refresh_token: string;
  public readonly user: AuthUserModel;

  private constructor(data: {
    access_token: string;
    refresh_token: string;
    user: AuthUserModel;
  }) {
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    this.user = data.user;
  }

  static create(
    accessToken: string,
    refreshToken: string,
    user: AuthUserModel,
  ): AuthResponseModel {
    return new AuthResponseModel({
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    });
  }
}
