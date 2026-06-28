import { Inject, type Provider } from '@nestjs/common';
import { BILL_REMINDERS_SERVICE, BILL_REMINDERS_CRON_SERVICE } from './bill-reminders.constants';
import { BillRemindersService } from './bill-reminders.service';
import { BillRemindersCronService } from './bill-reminders-cron.service';

export const InjectBillRemindersService = (): PropertyDecorator &
  ParameterDecorator => Inject(BILL_REMINDERS_SERVICE);

export const BillRemindersProvider: Provider = {
  provide: BILL_REMINDERS_SERVICE,
  useClass: BillRemindersService,
};

export const InjectBillRemindersCronService = (): PropertyDecorator &
  ParameterDecorator => Inject(BILL_REMINDERS_CRON_SERVICE);

export const BillRemindersCronProvider: Provider = {
  provide: BILL_REMINDERS_CRON_SERVICE,
  useClass: BillRemindersCronService,
};
