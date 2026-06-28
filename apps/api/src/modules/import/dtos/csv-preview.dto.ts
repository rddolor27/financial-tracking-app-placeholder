import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CsvPreviewDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsNotEmpty()
  csv_content: string;
}
