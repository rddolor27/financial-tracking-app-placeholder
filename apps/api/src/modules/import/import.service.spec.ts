import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImportService } from './import.service';
import { Transaction } from '../transactions/transaction.entity';
import { Account } from '../accounts/account.entity';
import { IMPORT_SERVICE } from './import.constants';
import { ImportProvider } from './import.service';

const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ImportService', () => {
  let service: ImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportProvider,
        { provide: getRepositoryToken(Transaction), useFactory: mockRepo },
        { provide: getRepositoryToken(Account), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<ImportService>(IMPORT_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse CSV content', async () => {
    const csv = 'date,description,amount,type\n2026-01-15,Coffee,-5.50,expense\n2026-01-16,Salary,3000,income';
    const rows = await service.parseCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0].description).toBe('Coffee');
    expect(rows[1].type).toBe('income');
  });

  it('should throw on empty CSV', async () => {
    await expect(service.parseCsv('header')).rejects.toThrow();
  });
});
