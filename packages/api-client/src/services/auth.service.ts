import type { AxiosInstance } from 'axios';
import type {
  AuthResponse,
  CreateUser,
  Login,
  RefreshTokenRequest,
} from '@financial-tracker/shared-types';

export class AuthService {
  constructor(private readonly client: AxiosInstance) {}

  async register(data: CreateUser): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: Login): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async refresh(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/refresh', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  getGoogleOAuthUrl(): string {
    return `${this.client.defaults.baseURL}/auth/google`;
  }
}
