export class BudgetModel {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  start_date: string;
  end_date: string | null;
  alert_threshold: number;
  spent: number;
  created_at: string;
  updated_at: string;
}
