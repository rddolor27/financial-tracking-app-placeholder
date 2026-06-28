import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dtos/create-budget.dto';
import { UpdateBudgetDto } from './dtos/update-budget.dto';
import { BudgetModel } from './models/budget.model';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetsRepo: Repository<Budget>,
  ) {}

  private async findEntityByUser(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetsRepo.findOne({
      where: { id, user_id: userId },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async findAllByUser(userId: string): Promise<BudgetModel[]> {
    const budgets = await this.budgetsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return budgets.map((entity) => BudgetModel.fromEntity(entity));
  }

  async findOneByUser(id: string, userId: string): Promise<BudgetModel> {
    const budget = await this.findEntityByUser(id, userId);
    return BudgetModel.fromEntity(budget);
  }

  async create(userId: string, data: CreateBudgetDto): Promise<BudgetModel> {
    const budget = this.budgetsRepo.create({ ...data, user_id: userId });
    const saved = await this.budgetsRepo.save(budget);
    return BudgetModel.fromEntity(saved);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateBudgetDto,
  ): Promise<BudgetModel> {
    const budget = await this.findEntityByUser(id, userId);
    this.budgetsRepo.merge(budget, data as Partial<Budget>);
    const saved = await this.budgetsRepo.save(budget);
    return BudgetModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const budget = await this.findEntityByUser(id, userId);
    await this.budgetsRepo.remove(budget);
  }
}
