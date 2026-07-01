import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillRemindersCronService } from './bill-reminders-cron.service';
import { BillReminder } from './bill-reminder.entity';
import { Notification } from '../notifications/notification.entity';
import { Transaction } from '../transactions/transaction.entity';
import { BILL_REMINDERS_CRON_SERVICE } from './bill-reminders.constants';
import { BillRemindersCronProvider } from './bill-reminders-cron.service';

const mockBillsRepo = () => ({
  find: jest.fn(),
  update: jest.fn(),
});

const mockNotificationsRepo = () => ({
  create: jest.fn((data) => data),
  save: jest.fn((data) => Promise.resolve(data)),
});

const mockTransactionsRepo = () => ({
  create: jest.fn((data) => data),
  save: jest.fn((data) => Promise.resolve(data)),
});

describe('BillRemindersCronService', () => {
  let service: BillRemindersCronService;
  let billsRepo: ReturnType<typeof mockBillsRepo>;
  let notificationsRepo: ReturnType<typeof mockNotificationsRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillRemindersCronProvider,
        { provide: getRepositoryToken(BillReminder), useFactory: mockBillsRepo },
        { provide: getRepositoryToken(Notification), useFactory: mockNotificationsRepo },
        { provide: getRepositoryToken(Transaction), useFactory: mockTransactionsRepo },
      ],
    }).compile();

    service = module.get<BillRemindersCronService>(BILL_REMINDERS_CRON_SERVICE);
    billsRepo = module.get(getRepositoryToken(BillReminder));
    notificationsRepo = module.get(getRepositoryToken(Notification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send notifications for upcoming bills', async () => {
    const today = new Date();
    const dueDay = today.getDate() + 2; // due in 2 days

    billsRepo.find.mockResolvedValue([
      {
        id: 'b1',
        user_id: 'u1',
        name: 'Netflix',
        amount: 549,
        currency: 'PHP',
        due_day: dueDay > 31 ? 1 : dueDay,
        reminder_days_before: 3,
        is_active: true,
        auto_create_transaction: false,
      },
    ]);

    await service.checkUpcomingBills();

    if (dueDay <= 31) {
      expect(notificationsRepo.save).toHaveBeenCalled();
    }
  });
});
