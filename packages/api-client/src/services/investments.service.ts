import type { AxiosInstance } from 'axios';
import type {
  Investment,
  CreateInvestment,
  UpdateInvestment,
  InvestmentTransaction,
  CreateInvestmentTransaction,
} from '@financial-tracker/shared-types';
import { BaseService } from './base.service';

export class InvestmentsService extends BaseService<Investment, CreateInvestment, UpdateInvestment> {
  constructor(client: AxiosInstance) {
    super(client, '/investments');
  }

  async getTransactions(investmentId: string): Promise<InvestmentTransaction[]> {
    const response = await this.client.get<InvestmentTransaction[]>(
      `/investments/${investmentId}/transactions`,
    );
    return response.data;
  }

  async createTransaction(data: CreateInvestmentTransaction): Promise<InvestmentTransaction> {
    const response = await this.client.post<InvestmentTransaction>(
      `/investments/${data.investment_id}/transactions`,
      data,
    );
    return response.data;
  }
}
