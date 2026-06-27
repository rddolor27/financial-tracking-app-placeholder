import type { AxiosInstance } from 'axios';
import type { BillReminder, CreateBillReminder, UpdateBillReminder } from '@financial-tracker/shared-types';

export class BillRemindersService {
  constructor(private readonly client: AxiosInstance) {}

  async getAll(): Promise<BillReminder[]> {
    const response = await this.client.get<BillReminder[]>('/bill-reminders');
    return response.data;
  }

  async getById(id: string): Promise<BillReminder> {
    const response = await this.client.get<BillReminder>(`/bill-reminders/${id}`);
    return response.data;
  }

  async create(data: CreateBillReminder): Promise<BillReminder> {
    const response = await this.client.post<BillReminder>('/bill-reminders', data);
    return response.data;
  }

  async update(id: string, data: UpdateBillReminder): Promise<BillReminder> {
    const response = await this.client.patch<BillReminder>(`/bill-reminders/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/bill-reminders/${id}`);
  }
}
