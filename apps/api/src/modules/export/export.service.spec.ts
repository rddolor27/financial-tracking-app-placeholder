import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExportService } from './export.service';
import { Transaction } from '../transactions/transaction.entity';
import { EXPORT_SERVICE } from './export.constants';
import { ExportProvider } from './export.service';

const mockRepo = () => ({
  find: jest.fn(),
});

describe('ExportService', () => {
  let service: ExportService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportProvider,
        { provide: getRepositoryToken(Transaction), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<ExportService>(EXPORT_SERVICE);
    repo = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export CSV', async () => {
    repo.find.mockResolvedValue([
      { date: '2026-01-15', description: 'Coffee', type: 'expense', amount: 150 },
      { date: '2026-01-16', description: 'Salary', type: 'income', amount: 50000 },
    ]);

    const csv = await service.exportCsv('u1', '2026-01-01', '2026-01-31');
    expect(csv).toContain('Date,Description,Type,Amount');
    expect(csv).toContain('Coffee');
    expect(csv).toContain('50000');
  });

  it('should export Excel as Buffer', async () => {
    repo.find.mockResolvedValue([
      { date: '2026-01-15', description: 'Coffee', type: 'expense', amount: 150 },
    ]);

    const buffer = await service.exportExcel('u1', '2026-01-01', '2026-01-31');
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should export PDF as Buffer', async () => {
    repo.find.mockResolvedValue([
      { date: '2026-01-15', description: 'Groceries', type: 'expense', amount: 2500 },
    ]);

    const buffer = await service.exportPdf('u1', '2026-01-01', '2026-01-31');
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
