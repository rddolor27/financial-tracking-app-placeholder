export class InvestmentTransactionModel {
  id: string;
  investment_id: string;
  user_id: string;
  type: string;
  quantity: number;
  price_per_unit: number;
  fees: number | null;
  date: string;
  notes: string | null;
  created_at: string;
}
