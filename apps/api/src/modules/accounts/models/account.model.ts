export class AccountModel {
  id: string;
  user_id: string;
  name: string;
  bank_name: string | null;
  type: string;
  balance: number;
  currency: string;
  color: string | null;
  icon: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
