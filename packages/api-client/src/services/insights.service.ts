import type { AxiosInstance } from 'axios';

export interface SpendingByCategory {
  category_id: string;
  total: number;
}

export interface IncomeVsExpense {
  income: number;
  expense: number;
  net: number;
}

export interface TrendPoint {
  month: string;
  type: string;
  total: number;
}

export interface SavingsRate {
  income: number;
  expense: number;
  savings: number;
  rate: number;
}

export class InsightsService {
  constructor(private readonly client: AxiosInstance) {}

  async spendingByCategory(startDate: string, endDate: string): Promise<SpendingByCategory[]> {
    const response = await this.client.get<SpendingByCategory[]>('/insights/spending-by-category', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async incomeVsExpense(startDate: string, endDate: string): Promise<IncomeVsExpense> {
    const response = await this.client.get<IncomeVsExpense>('/insights/income-vs-expense', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async trends(startDate: string, endDate: string): Promise<TrendPoint[]> {
    const response = await this.client.get<TrendPoint[]>('/insights/trends', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async savingsRate(startDate: string, endDate: string): Promise<SavingsRate> {
    const response = await this.client.get<SavingsRate>('/insights/savings-rate', {
      params: { startDate, endDate },
    });
    return response.data;
  }
}
