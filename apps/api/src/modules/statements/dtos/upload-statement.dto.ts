import { UploadStatementSchema } from '@financial-tracker/shared-types';
import type { z } from 'zod';

export type UploadStatementDto = z.infer<typeof UploadStatementSchema>;
export { UploadStatementSchema };
