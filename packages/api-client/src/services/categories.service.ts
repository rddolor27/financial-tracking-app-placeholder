import type { AxiosInstance } from 'axios';
import type { CategoryResponse, CreateCategory, UpdateCategory } from '@financial-tracker/shared-types';

export class CategoriesService {
  constructor(private readonly client: AxiosInstance) {}

  async getAll(): Promise<CategoryResponse[]> {
    const response = await this.client.get<CategoryResponse[]>('/categories');
    return response.data;
  }

  async getById(id: string): Promise<CategoryResponse> {
    const response = await this.client.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  }

  async create(data: CreateCategory): Promise<CategoryResponse> {
    const response = await this.client.post<CategoryResponse>('/categories', data);
    return response.data;
  }

  async update(id: string, data: UpdateCategory): Promise<CategoryResponse> {
    const response = await this.client.patch<CategoryResponse>(`/categories/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/categories/${id}`);
  }
}
