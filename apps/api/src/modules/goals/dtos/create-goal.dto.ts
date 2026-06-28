import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  target_amount: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsDateString()
  @IsOptional()
  target_date?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
