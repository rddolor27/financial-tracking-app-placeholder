import type { AxiosInstance } from 'axios';
import type { PaginationQuery, PaginationMeta } from '@financial-tracker/shared-types';

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export abstract class BaseService<TResponse, TCreate, TUpdate> {
  constructor(
    protected readonly client: AxiosInstance,
    protected readonly basePath: string,
  ) {}

  async getAll(params?: PaginationQuery & Record<string, unknown>): Promise<PaginatedResponse<TResponse>> {
    const response = await this.client.get<PaginatedResponse<TResponse>>(this.basePath, { params });
    return response.data;
  }

  async getById(id: string): Promise<TResponse> {
    const response = await this.client.get<TResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: TCreate): Promise<TResponse> {
    const response = await this.client.post<TResponse>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: TUpdate): Promise<TResponse> {
    const response = await this.client.patch<TResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`${this.basePath}/${id}`);
  }
}
