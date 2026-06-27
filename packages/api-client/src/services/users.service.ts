import { AxiosInstance } from 'axios';
import type { User } from '@financial-tracker/shared-types';

export class UsersService {
  constructor(private readonly client: AxiosInstance) {}

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }

  async updateProfile(data: { first_name?: string; last_name?: string; currency?: string }): Promise<User> {
    const response = await this.client.patch<User>('/users/me', data);
    return response.data;
  }

  async changePassword(data: { current_password: string; new_password: string }): Promise<void> {
    await this.client.post('/users/me/password', data);
  }
}
