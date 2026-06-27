import axios from 'axios';
import { createApiClient } from './client';

jest.mock('axios', () => {
  const mockInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    defaults: { headers: { common: {} } },
  };
  return {
    create: jest.fn(() => mockInstance),
    __esModule: true,
    default: { create: jest.fn(() => mockInstance) },
  };
});

describe('createApiClient', () => {
  it('should create an axios instance with base URL', () => {
    const client = createApiClient({ baseURL: 'http://localhost:3000/api' });
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:3000/api',
      }),
    );
    expect(client).toBeDefined();
  });

  it('should set up request interceptor', () => {
    const client = createApiClient({ baseURL: 'http://localhost:3000/api' });
    expect(client.interceptors.request.use).toHaveBeenCalled();
  });

  it('should set up response interceptor', () => {
    const client = createApiClient({ baseURL: 'http://localhost:3000/api' });
    expect(client.interceptors.response.use).toHaveBeenCalled();
  });
});
