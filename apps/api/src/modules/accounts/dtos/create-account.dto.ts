import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  bank_name?: string;

  @IsEnum(['checking', 'savings', 'credit_card', 'cash', 'investment', 'loan', 'e_wallet'])
  @IsNotEmpty()
  type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan' | 'e_wallet';

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
