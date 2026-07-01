import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeRatesService } from './exchange-rates.service';
import { ExchangeRate } from './exchange-rate.entity';
import { EXCHANGE_RATES_SERVICE } from './exchange-rates.constants';
import { ExchangeRatesProvider } from './exchange-rates.service';

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
        ExchangeRatesProvider,
        { provide: getRepositoryToken(ExchangeRate), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<ExchangeRatesService>(EXCHANGE_RATES_SERVICE);
    repo = module.get(getRepositoryToken(ExchangeRate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return null for same currency', async () => {
    const rate = await service.getRate('PHP', 'PHP');
    expect(rate).toBeNull();
  });

  it('should return model from database', async () => {
    repo.findOne.mockResolvedValue({
      id: '1',
      base_currency: 'PHP',
      target_currency: 'USD',
      rate: 0.018,
      fetched_at: new Date(),
      created_at: new Date(),
    });
    const rate = await service.getRate('PHP', 'USD');
    expect(rate).not.toBeNull();
    expect(rate!.rate).toBe(0.018);
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
