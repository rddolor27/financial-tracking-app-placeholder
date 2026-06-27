import { z } from 'zod';
import { StatementTypeEnum, ParseStatusEnum, ParseMethodEnum } from '../enums';

export const StatementSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  account_id: z.string().uuid().nullable(),
  file_name: z.string().max(255),
  file_url: z.string().max(500),
  file_size: z.number().int().positive(),
  statement_type: StatementTypeEnum,
  parse_status: ParseStatusEnum,
  parse_method: ParseMethodEnum.nullable(),
  parsed_data: z.unknown().nullable(),
  transactions_created: z.number().int().min(0).default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Statement = z.infer<typeof StatementSchema>;

export const UploadStatementSchema = z.object({
  account_id: z.string().uuid().nullable().optional(),
  statement_type: StatementTypeEnum,
});

export type UploadStatement = z.infer<typeof UploadStatementSchema>;
