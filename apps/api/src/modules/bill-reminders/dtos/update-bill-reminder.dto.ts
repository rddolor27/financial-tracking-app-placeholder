import { UpdateBillReminderSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UpdateBillReminderDto = z.infer<typeof UpdateBillReminderSchema>;
export { UpdateBillReminderSchema };
