import { CreateInvestmentTransactionDto } from '../dtos/create-investment-transaction.dto';
import { InvestmentTransaction } from '../investment-transaction.entity';

export class InvestmentTransactionModel {
  public readonly id?: string;
  public readonly investment_id?: string;
  public readonly user_id?: string;
  public readonly type: 'buy' | 'sell' | 'dividend';
  public readonly quantity: number;
  public readonly price_per_unit: number;
  public readonly total_amount: number;
  public readonly fees: number;
  public readonly date: string;
  public readonly notes?: string | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    investment_id?: string;
    user_id?: string;
    type: 'buy' | 'sell' | 'dividend';
    quantity: number;
    price_per_unit: number;
    total_amount: number;
    fees: number;
    date: string;
    notes?: string | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.investment_id = data.investment_id;
    this.user_id = data.user_id;
    this.type = data.type;
    this.quantity = data.quantity;
    this.price_per_unit = data.price_per_unit;
    this.total_amount = data.total_amount;
    this.fees = data.fees;
    this.date = data.date;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromCreateDTO(
    dto: CreateInvestmentTransactionDto,
  ): InvestmentTransactionModel {
    return new InvestmentTransactionModel({
      type: dto.type,
      quantity: dto.quantity,
      price_per_unit: dto.price_per_unit,
      total_amount: dto.quantity * dto.price_per_unit,
      fees: dto.fees ?? 0,
      date: dto.date,
      notes: dto.notes ?? null,
    });
  }

  static fromEntity(
    entity: InvestmentTransaction,
  ): InvestmentTransactionModel {
    return new InvestmentTransactionModel({
      id: entity.id,
      investment_id: entity.investment_id,
      user_id: entity.user_id,
      type: entity.type,
      quantity: entity.quantity,
      price_per_unit: entity.price_per_unit,
      total_amount: entity.total_amount,
      fees: entity.fees,
      date: entity.date,
      notes: entity.notes,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
