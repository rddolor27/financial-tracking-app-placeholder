import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsPositive,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateBillReminderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;

  @IsNumber()
  @Min(1)
  @Max(31)
  due_day: number;

  @IsEnum(['monthly', 'quarterly', 'yearly'])
  @IsNotEmpty()
  frequency: 'monthly' | 'quarterly' | 'yearly';

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsUUID()
  @IsOptional()
  account_id?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  reminder_days_before: number;

  @IsBoolean()
  @IsNotEmpty()
  auto_create_transaction: boolean;
}
