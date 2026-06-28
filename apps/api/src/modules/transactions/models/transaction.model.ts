export class TransactionModel {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: string;
  amount: number;
  description: string | null;
  date: string;
  transfer_to_account_id: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  is_recurring: boolean;
  recurring_interval: string | null;
  recurring_next_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}
