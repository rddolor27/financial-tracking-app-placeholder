import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import type { CreateGoalDto, UpdateGoalDto } from './dtos';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalsRepo: Repository<Goal>,
  ) {}

  async findAllByUser(userId: string): Promise<Goal[]> {
    return this.goalsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalsRepo.findOne({ where: { id, user_id: userId } });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async create(userId: string, data: CreateGoalDto): Promise<Goal> {
    const goal = this.goalsRepo.create({ ...data, user_id: userId, current_amount: 0 });
    return this.goalsRepo.save(goal);
  }

  async update(id: string, userId: string, data: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOneByUser(id, userId);
    this.goalsRepo.merge(goal, data);
    return this.goalsRepo.save(goal);
  }

  async contribute(id: string, userId: string, amount: number): Promise<Goal> {
    const goal = await this.findOneByUser(id, userId);
    goal.current_amount = Number(goal.current_amount) + amount;
    if (goal.current_amount >= Number(goal.target_amount)) {
      goal.is_completed = true;
    }
    return this.goalsRepo.save(goal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOneByUser(id, userId);
    await this.goalsRepo.remove(goal);
  }
}
