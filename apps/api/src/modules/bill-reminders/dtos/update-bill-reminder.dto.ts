import { PartialType } from '@nestjs/mapped-types';
import { CreateBillReminderDto } from './create-bill-reminder.dto';

export class UpdateBillReminderDto extends PartialType(CreateBillReminderDto) {}
