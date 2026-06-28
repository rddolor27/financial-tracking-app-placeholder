import type { AxiosInstance } from 'axios';
import { GoalsService } from './goals.service';

function createMockClient() {
  return {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as AxiosInstance;
}

describe('GoalsService', () => {
  let client: AxiosInstance;
  let service: GoalsService;

  beforeEach(() => {
    client = createMockClient();
    service = new GoalsService(client);
  });

  it('should fetch all goals', async () => {
    const goals = [{ id: '1', name: 'Emergency Fund' }];
    (client.get as jest.Mock).mockResolvedValue({ data: goals });

    const result = await service.getAll();
    expect(client.get).toHaveBeenCalledWith('/goals');
    expect(result).toEqual(goals);
  });

  it('should fetch a goal by id', async () => {
    const goal = { id: '1', name: 'Emergency Fund' };
    (client.get as jest.Mock).mockResolvedValue({ data: goal });

    const result = await service.getById('1');
    expect(client.get).toHaveBeenCalledWith('/goals/1');
    expect(result).toEqual(goal);
  });

  it('should create a goal', async () => {
    const newGoal = { id: '1', name: 'Vacation' };
    (client.post as jest.Mock).mockResolvedValue({ data: newGoal });

    const result = await service.create({ name: 'Vacation', target_amount: 50000, currency: 'PHP' } as Parameters<typeof service.create>[0]);
    expect(client.post).toHaveBeenCalledWith('/goals', expect.objectContaining({ name: 'Vacation' }));
    expect(result).toEqual(newGoal);
  });

  it('should contribute to a goal', async () => {
    const updated = { id: '1', name: 'Vacation', current_amount: 5000 };
    (client.post as jest.Mock).mockResolvedValue({ data: updated });

    const result = await service.contribute('1', { amount: 5000 });
    expect(client.post).toHaveBeenCalledWith('/goals/1/contribute', { amount: 5000 });
    expect(result).toEqual(updated);
  });

  it('should delete a goal', async () => {
    (client.delete as jest.Mock).mockResolvedValue({});

    await service.delete('1');
    expect(client.delete).toHaveBeenCalledWith('/goals/1');
  });
});
