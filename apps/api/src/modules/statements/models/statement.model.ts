import { Statement } from '../statement.entity';

export class StatementModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly account_id?: string | null;
  public readonly file_name: string;
  public readonly file_url: string;
  public readonly file_size: number;
  public readonly statement_type: 'bank' | 'credit_card' | 'investment' | 'other';
  public readonly parse_status: 'pending' | 'processing' | 'completed' | 'failed';
  public readonly parse_method?: 'rule_based' | 'llm' | 'client_side' | null;
  public readonly parsed_data?: unknown;
  public readonly transactions_created: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    account_id?: string | null;
    file_name: string;
    file_url: string;
    file_size: number;
    statement_type: 'bank' | 'credit_card' | 'investment' | 'other';
    parse_status: 'pending' | 'processing' | 'completed' | 'failed';
    parse_method?: 'rule_based' | 'llm' | 'client_side' | null;
    parsed_data?: unknown;
    transactions_created: number;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.account_id = data.account_id;
    this.file_name = data.file_name;
    this.file_url = data.file_url;
    this.file_size = data.file_size;
    this.statement_type = data.statement_type;
    this.parse_status = data.parse_status;
    this.parse_method = data.parse_method;
    this.parsed_data = data.parsed_data;
    this.transactions_created = data.transactions_created;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromEntity(entity: Statement): StatementModel {
    return new StatementModel({
      id: entity.id,
      user_id: entity.user_id,
      account_id: entity.account_id,
      file_name: entity.file_name,
      file_url: entity.file_url,
      file_size: entity.file_size,
      statement_type: entity.statement_type,
      parse_status: entity.parse_status,
      parse_method: entity.parse_method,
      parsed_data: entity.parsed_data,
      transactions_created: entity.transactions_created,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
