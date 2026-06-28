export class InvestmentModel {
  id: string;
  user_id: string;
  account_id: string;
  symbol: string;
  name: string;
  asset_type: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
}
