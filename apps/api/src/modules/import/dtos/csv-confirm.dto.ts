import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CsvRowDto {
  [key: string]: any;
}

export class CsvConfirmDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CsvRowDto)
  rows: CsvRowDto[];

  @IsUUID()
  @IsNotEmpty()
  default_category_id: string;
}
