import { AxiosInstance } from 'axios';

export class ExportService {
  constructor(private readonly client: AxiosInstance) {}

  async exportCsv(startDate: string, endDate: string): Promise<Blob> {
    const response = await this.client.get('/export/csv', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
    return response.data;
  }

  async exportExcel(startDate: string, endDate: string): Promise<Blob> {
    const response = await this.client.get('/export/excel', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
    return response.data;
  }

  async exportPdf(startDate: string, endDate: string): Promise<Blob> {
    const response = await this.client.get('/export/pdf', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
    return response.data;
  }
}
