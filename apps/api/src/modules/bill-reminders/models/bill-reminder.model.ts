export class BillReminderModel {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  due_day: number;
  frequency: string;
  category_id: string | null;
  account_id: string | null;
  reminder_days_before: number;
  auto_create_transaction: boolean;
  is_active: boolean;
  last_paid_date: string | null;
  created_at: string;
  updated_at: string;
}
