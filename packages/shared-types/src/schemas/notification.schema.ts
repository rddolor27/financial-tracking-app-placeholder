import { z } from 'zod';
import { NotificationTypeEnum } from '../enums';

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: NotificationTypeEnum,
  title: z.string().max(255),
  message: z.string(),
  is_read: z.boolean().default(false),
  metadata: z.record(z.unknown()).nullable(),
  created_at: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = z.object({
  type: NotificationTypeEnum,
  title: z.string().max(255),
  message: z.string(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
