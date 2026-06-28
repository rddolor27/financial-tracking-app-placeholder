export class StatementModel {
  id: string;
  user_id: string;
  account_id: string | null;
  original_filename: string;
  file_path: string;
  statement_type: string;
  parse_status: string;
  parsed_data: Record<string, any> | null;
  transactions_created: number;
  created_at: string;
  updated_at: string;
}
