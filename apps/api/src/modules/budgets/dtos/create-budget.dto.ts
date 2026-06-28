import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

export class CreateBudgetDto {
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(['weekly', 'monthly', 'yearly'])
  @IsNotEmpty()
  period: 'weekly' | 'monthly' | 'yearly';

  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  alert_threshold: number;
}
