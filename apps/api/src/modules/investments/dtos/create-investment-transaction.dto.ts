import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsPositive,
} from 'class-validator';

export class CreateInvestmentTransactionDto {
  @IsEnum(['buy', 'sell', 'dividend'])
  @IsNotEmpty()
  type: 'buy' | 'sell' | 'dividend';

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price_per_unit: number;

  @IsNumber()
  @IsOptional()
  fees?: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
