import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['crypto', 'us_stock', 'ph_stock'])
  @IsNotEmpty()
  asset_type: 'crypto' | 'us_stock' | 'ph_stock';

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  avg_buy_price: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;
}
