import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statement } from './statement.entity';

@Injectable()
export class StatementsService {
  constructor(
    @InjectRepository(Statement)
    private readonly statementsRepo: Repository<Statement>,
  ) {}

  async findAllByUser(userId: string): Promise<Statement[]> {
    return this.statementsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Statement> {
    const statement = await this.statementsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!statement) throw new NotFoundException('Statement not found');
    return statement;
  }

  async create(userId: string, data: Partial<Statement>): Promise<Statement> {
    const statement = this.statementsRepo.create({
      ...data,
      user_id: userId,
      parse_status: 'pending',
    });
    return this.statementsRepo.save(statement);
  }

  async updateParseStatus(
    id: string,
    userId: string,
    status: string,
    parsedData?: Record<string, unknown>,
    transactionsCreated?: number,
  ): Promise<Statement> {
    const statement = await this.findOneByUser(id, userId);
    statement.parse_status = status as Statement['parse_status'];
    if (parsedData) statement.parsed_data = parsedData;
    if (transactionsCreated !== undefined)
      statement.transactions_created = transactionsCreated;
    return this.statementsRepo.save(statement);
  }

  async remove(id: string, userId: string): Promise<void> {
    const statement = await this.findOneByUser(id, userId);
    await this.statementsRepo.remove(statement);
  }
}
