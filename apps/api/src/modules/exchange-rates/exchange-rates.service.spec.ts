import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeRatesService } from './exchange-rates.service';
import { ExchangeRate } from './exchange-rate.entity';

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  upsert: jest.fn(),
});

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRatesService,
        { provide: getRepositoryToken(ExchangeRate), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<ExchangeRatesService>(ExchangeRatesService);
    repo = module.get(getRepositoryToken(ExchangeRate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 1 for same currency', async () => {
    const rate = await service.getRate('PHP', 'PHP');
    expect(rate).toBe(1);
  });

  it('should return rate from database', async () => {
    repo.findOne.mockResolvedValue({ rate: 0.018 });
    const rate = await service.getRate('PHP', 'USD');
    expect(rate).toBe(0.018);
  });

  it('should return null if rate not found', async () => {
    repo.findOne.mockResolvedValue(null);
    const rate = await service.getRate('PHP', 'XYZ');
    expect(rate).toBeNull();
  });

  it('should convert amounts', async () => {
    repo.findOne.mockResolvedValue({ rate: 0.018 });
    const converted = await service.convert(1000, 'PHP', 'USD');
    expect(converted).toBe(18);
  });
});
