import { IsDateString, IsOptional } from 'class-validator';

export class ExportQueryDto {
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;
}
