import { IsDateString, IsNotEmpty } from 'class-validator';

export class InsightsQueryDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;
}
