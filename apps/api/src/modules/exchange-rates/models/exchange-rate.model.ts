import { ExchangeRate } from '../exchange-rate.entity';

export class ExchangeRateModel {
  public readonly id?: string;
  public readonly base_currency: string;
  public readonly target_currency: string;
  public readonly rate: number;
  public readonly fetched_at: Date;
  public readonly created_at?: Date;

  private constructor(data: {
    id?: string;
    base_currency: string;
    target_currency: string;
    rate: number;
    fetched_at: Date;
    created_at?: Date;
  }) {
    this.id = data.id;
    this.base_currency = data.base_currency;
    this.target_currency = data.target_currency;
    this.rate = data.rate;
    this.fetched_at = data.fetched_at;
    this.created_at = data.created_at;
  }

  static fromEntity(entity: ExchangeRate): ExchangeRateModel {
    return new ExchangeRateModel({
      id: entity.id,
      base_currency: entity.base_currency,
      target_currency: entity.target_currency,
      rate: entity.rate,
      fetched_at: entity.fetched_at,
      created_at: entity.created_at,
    });
  }
}
