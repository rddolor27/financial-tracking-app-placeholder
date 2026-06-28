import { CreateAccountDto } from '../dtos/create-account.dto';
import { UpdateAccountDto } from '../dtos/update-account.dto';
import { Account } from '../account.entity';

export class AccountModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly name: string;
  public readonly bank_name?: string | null;
  public readonly type:
    | 'checking'
    | 'savings'
    | 'credit_card'
    | 'cash'
    | 'investment'
    | 'loan'
    | 'e_wallet';
  public readonly balance: number;
  public readonly currency: string;
  public readonly color?: string | null;
  public readonly icon?: string | null;
  public readonly logo_url?: string | null;
  public readonly is_active?: boolean;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    name: string;
    bank_name?: string | null;
    type:
      | 'checking'
      | 'savings'
      | 'credit_card'
      | 'cash'
      | 'investment'
      | 'loan'
      | 'e_wallet';
    balance: number;
    currency: string;
    color?: string | null;
    icon?: string | null;
    logo_url?: string | null;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.bank_name = data.bank_name;
    this.type = data.type;
    this.balance = data.balance;
    this.currency = data.currency;
    this.color = data.color;
    this.icon = data.icon;
    this.logo_url = data.logo_url;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateAccountDto): AccountModel {
    return new AccountModel({
      name: dto.name,
      bank_name: dto.bank_name ?? null,
      type: dto.type,
      balance: dto.balance ?? 0,
      currency: dto.currency ?? 'PHP',
      color: dto.color ?? null,
      icon: dto.icon ?? null,
    });
  }

  static fromUpdateDTO(dto: UpdateAccountDto): AccountModel {
    return new AccountModel({
      name: dto.name ?? '',
      type: dto.type ?? 'checking',
      balance: dto.balance ?? 0,
      currency: dto.currency ?? 'PHP',
      bank_name: dto.bank_name,
      color: dto.color,
      icon: dto.icon,
    });
  }

  static fromEntity(entity: Account): AccountModel {
    return new AccountModel({
      id: entity.id,
      user_id: entity.user_id,
      name: entity.name,
      bank_name: entity.bank_name,
      type: entity.type,
      balance: entity.balance,
      currency: entity.currency,
      color: entity.color,
      icon: entity.icon,
      logo_url: entity.logo_url,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
