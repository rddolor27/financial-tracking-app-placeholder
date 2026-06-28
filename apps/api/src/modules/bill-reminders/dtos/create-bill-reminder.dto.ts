import { CreateBillReminderSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type CreateBillReminderDto = z.infer<typeof CreateBillReminderSchema>;
export { CreateBillReminderSchema };
