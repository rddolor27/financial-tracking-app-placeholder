import { AxiosInstance } from 'axios';

export interface ImportPreview {
  rowCount: number;
  duplicates: number;
  rows: Array<{
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category_id?: string;
  }>;
}

export class ImportService {
  constructor(private readonly client: AxiosInstance) {}

  async previewCsv(file: File, accountId: string): Promise<ImportPreview> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('account_id', accountId);
    const response = await this.client.post<ImportPreview>('/import/csv/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async confirmCsv(
    file: File,
    accountId: string,
    categoryId?: string,
  ): Promise<{ created: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('account_id', accountId);
    if (categoryId) formData.append('category_id', categoryId);
    const response = await this.client.post<{ created: number }>('/import/csv/confirm', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}
