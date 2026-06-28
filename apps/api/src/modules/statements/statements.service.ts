import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statement } from './statement.entity';
import { StatementModel } from './models/statement.model';

@Injectable()
export class StatementsService {
  constructor(
    @InjectRepository(Statement)
    private readonly statementsRepo: Repository<Statement>,
  ) {}

  private async findEntityByUser(id: string, userId: string): Promise<Statement> {
    const statement = await this.statementsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!statement) throw new NotFoundException('Statement not found');
    return statement;
  }

  async findAllByUser(userId: string): Promise<StatementModel[]> {
    const statements = await this.statementsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return statements.map((entity) => StatementModel.fromEntity(entity));
  }

  async findOneByUser(id: string, userId: string): Promise<StatementModel> {
    const statement = await this.findEntityByUser(id, userId);
    return StatementModel.fromEntity(statement);
  }

  async create(userId: string, data: Partial<Statement>): Promise<StatementModel> {
    const statement = this.statementsRepo.create({
      ...data,
      user_id: userId,
      parse_status: 'pending',
    });
    const saved = await this.statementsRepo.save(statement);
    return StatementModel.fromEntity(saved);
  }

  async updateParseStatus(
    id: string,
    userId: string,
    status: string,
    parsedData?: Record<string, unknown>,
    transactionsCreated?: number,
  ): Promise<StatementModel> {
    const statement = await this.findEntityByUser(id, userId);
    statement.parse_status = status as Statement['parse_status'];
    if (parsedData) statement.parsed_data = parsedData;
    if (transactionsCreated !== undefined)
      statement.transactions_created = transactionsCreated;
    const saved = await this.statementsRepo.save(statement);
    return StatementModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const statement = await this.findEntityByUser(id, userId);
    await this.statementsRepo.remove(statement);
  }
}
