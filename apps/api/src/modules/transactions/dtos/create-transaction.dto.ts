import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  IsDateString,
  IsPositive,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsEnum(['income', 'expense', 'transfer'])
  @IsNotEmpty()
  type: 'income' | 'expense' | 'transfer';

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsUUID()
  @IsOptional()
  transfer_to_account_id?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  location_name?: string;

  @IsBoolean()
  @IsNotEmpty()
  is_recurring: boolean;

  @IsEnum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly'])
  @IsOptional()
  recurring_interval?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
