import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UploadStatementDto {
  @IsUUID()
  @IsOptional()
  account_id?: string;

  @IsEnum(['bank', 'credit_card', 'investment', 'other'])
  @IsNotEmpty()
  statement_type: 'bank' | 'credit_card' | 'investment' | 'other';
}
