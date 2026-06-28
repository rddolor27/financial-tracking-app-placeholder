import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { UpdateInvestmentDto } from '../dtos/update-investment.dto';
import { Investment } from '../investment.entity';

export class InvestmentModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly account_id: string;
  public readonly symbol: string;
  public readonly name: string;
  public readonly asset_type: 'crypto' | 'us_stock' | 'ph_stock';
  public readonly quantity: number;
  public readonly avg_buy_price: number;
  public readonly current_price: number;
  public readonly currency: string;
  public readonly price_updated_at?: Date | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    account_id: string;
    symbol: string;
    name: string;
    asset_type: 'crypto' | 'us_stock' | 'ph_stock';
    quantity: number;
    avg_buy_price: number;
    current_price: number;
    currency: string;
    price_updated_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.account_id = data.account_id;
    this.symbol = data.symbol;
    this.name = data.name;
    this.asset_type = data.asset_type;
    this.quantity = data.quantity;
    this.avg_buy_price = data.avg_buy_price;
    this.current_price = data.current_price;
    this.currency = data.currency;
    this.price_updated_at = data.price_updated_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(dto: CreateInvestmentDto): InvestmentModel {
    return new InvestmentModel({
      account_id: dto.account_id,
      symbol: dto.symbol,
      name: dto.name,
      asset_type: dto.asset_type,
      quantity: dto.quantity,
      avg_buy_price: dto.avg_buy_price,
      current_price: 0,
      currency: dto.currency,
    });
  }

  static fromUpdateDTO(dto: UpdateInvestmentDto): InvestmentModel {
    return new InvestmentModel({
      account_id: '',
      symbol: '',
      name: dto.name ?? '',
      asset_type: 'crypto',
      quantity: dto.quantity ?? 0,
      avg_buy_price: dto.avg_buy_price ?? 0,
      current_price: 0,
      currency: '',
    });
  }

  static fromEntity(entity: Investment): InvestmentModel {
    return new InvestmentModel({
      id: entity.id,
      user_id: entity.user_id,
      account_id: entity.account_id,
      symbol: entity.symbol,
      name: entity.name,
      asset_type: entity.asset_type,
      quantity: entity.quantity,
      avg_buy_price: entity.avg_buy_price,
      current_price: entity.current_price,
      currency: entity.currency,
      price_updated_at: entity.price_updated_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
