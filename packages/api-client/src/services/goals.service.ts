import type { AxiosInstance } from 'axios';
import type { Goal, CreateGoal, UpdateGoal, ContributeGoal } from '@financial-tracker/shared-types';

export class GoalsService {
  constructor(private readonly client: AxiosInstance) {}

  async getAll(): Promise<Goal[]> {
    const response = await this.client.get<Goal[]>('/goals');
    return response.data;
  }

  async getById(id: string): Promise<Goal> {
    const response = await this.client.get<Goal>(`/goals/${id}`);
    return response.data;
  }

  async create(data: CreateGoal): Promise<Goal> {
    const response = await this.client.post<Goal>('/goals', data);
    return response.data;
  }

  async update(id: string, data: UpdateGoal): Promise<Goal> {
    const response = await this.client.patch<Goal>(`/goals/${id}`, data);
    return response.data;
  }

  async contribute(id: string, data: ContributeGoal): Promise<Goal> {
    const response = await this.client.post<Goal>(`/goals/${id}/contribute`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/goals/${id}`);
  }
}
