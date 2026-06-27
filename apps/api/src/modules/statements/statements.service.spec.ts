import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { StatementsService } from './statements.service';
import { Statement } from './statement.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('StatementsService', () => {
  let service: StatementsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatementsService,
        { provide: getRepositoryToken(Statement), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<StatementsService>(StatementsService);
    repo = module.get(getRepositoryToken(Statement));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUser', () => {
    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneByUser('999', 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a statement with pending status', async () => {
      const dto = { file_name: 'statement.pdf', file_url: '/uploads/statement.pdf', file_size: 1024, statement_type: 'bank' as const };
      const statement = { id: '1', user_id: 'u1', parse_status: 'pending', ...dto } as Statement;
      repo.create.mockReturnValue(statement);
      repo.save.mockResolvedValue(statement);

      const result = await service.create('u1', dto);
      expect(result.parse_status).toBe('pending');
    });
  });

  describe('updateParseStatus', () => {
    it('should update parse status', async () => {
      const statement = { id: '1', user_id: 'u1', parse_status: 'pending' } as Statement;
      repo.findOne.mockResolvedValue(statement);
      repo.save.mockImplementation((s: Statement) => Promise.resolve(s));

      const result = await service.updateParseStatus('1', 'u1', 'completed', { transactions: [] }, 5);
      expect(result.parse_status).toBe('completed');
      expect(result.transactions_created).toBe(5);
    });
  });
});
