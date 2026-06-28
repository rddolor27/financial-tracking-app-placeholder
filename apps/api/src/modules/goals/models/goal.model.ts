export class GoalModel {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  target_date: string | null;
  icon: string | null;
  color: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
