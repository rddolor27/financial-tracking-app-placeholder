import type { AxiosInstance } from 'axios';
import { BaseService } from './base.service';

class TestService extends BaseService<{ id: string; name: string }, { name: string }, { name?: string }> {
  constructor(client: AxiosInstance) {
    super(client, '/test');
  }
}

function createMockClient() {
  return {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as AxiosInstance;
}

describe('BaseService', () => {
  let client: AxiosInstance;
  let service: TestService;

  beforeEach(() => {
    client = createMockClient();
    service = new TestService(client);
  });

  it('should call GET on getAll', async () => {
    const mockData = { data: [{ id: '1', name: 'Test' }], meta: { hasNextPage: false, total: 1 } };
    (client.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await service.getAll();
    expect(client.get).toHaveBeenCalledWith('/test', { params: undefined });
    expect(result).toEqual(mockData);
  });

  it('should pass params to getAll', async () => {
    (client.get as jest.Mock).mockResolvedValue({ data: { data: [], meta: {} } });

    await service.getAll({ limit: 10, order: 'asc' as const });
    expect(client.get).toHaveBeenCalledWith('/test', { params: { limit: 10, order: 'asc' } });
  });

  it('should call GET with id on getById', async () => {
    (client.get as jest.Mock).mockResolvedValue({ data: { id: '1', name: 'Test' } });

    const result = await service.getById('1');
    expect(client.get).toHaveBeenCalledWith('/test/1');
    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('should call POST on create', async () => {
    (client.post as jest.Mock).mockResolvedValue({ data: { id: '1', name: 'New' } });

    const result = await service.create({ name: 'New' });
    expect(client.post).toHaveBeenCalledWith('/test', { name: 'New' });
    expect(result).toEqual({ id: '1', name: 'New' });
  });

  it('should call PATCH on update', async () => {
    (client.patch as jest.Mock).mockResolvedValue({ data: { id: '1', name: 'Updated' } });

    const result = await service.update('1', { name: 'Updated' });
    expect(client.patch).toHaveBeenCalledWith('/test/1', { name: 'Updated' });
    expect(result).toEqual({ id: '1', name: 'Updated' });
  });

  it('should call DELETE on delete', async () => {
    (client.delete as jest.Mock).mockResolvedValue({});

    await service.delete('1');
    expect(client.delete).toHaveBeenCalledWith('/test/1');
  });
});
