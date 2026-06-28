import { Notification } from '../notification.entity';

export class NotificationModel {
  public readonly id?: string;
  public readonly user_id?: string;
  public readonly type:
    | 'budget_alert'
    | 'bill_reminder'
    | 'goal_reached'
    | 'sync_conflict'
    | 'statement_parsed'
    | 'system';
  public readonly title: string;
  public readonly message: string;
  public readonly is_read: boolean;
  public readonly metadata?: Record<string, unknown> | null;
  public readonly created_at?: Date;

  private constructor(data: {
    id?: string;
    user_id?: string;
    type:
      | 'budget_alert'
      | 'bill_reminder'
      | 'goal_reached'
      | 'sync_conflict'
      | 'statement_parsed'
      | 'system';
    title: string;
    message: string;
    is_read: boolean;
    metadata?: Record<string, unknown> | null;
    created_at?: Date;
  }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.is_read = data.is_read;
    this.metadata = data.metadata;
    this.created_at = data.created_at;
  }

  static fromEntity(entity: Notification): NotificationModel {
    return new NotificationModel({
      id: entity.id,
      user_id: entity.user_id,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      is_read: entity.is_read,
      metadata: entity.metadata,
      created_at: entity.created_at,
    });
  }
}
