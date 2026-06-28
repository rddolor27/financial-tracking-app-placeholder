import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateInvestmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  avg_buy_price?: number;
}
