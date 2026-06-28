import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { CreateGoalDto } from './dtos/create-goal.dto';
import { UpdateGoalDto } from './dtos/update-goal.dto';
import { GoalModel } from './models/goal.model';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalsRepo: Repository<Goal>,
  ) {}

  private async findEntityByUser(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalsRepo.findOne({ where: { id, user_id: userId } });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async findAllByUser(userId: string): Promise<GoalModel[]> {
    const goals = await this.goalsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return goals.map((entity) => GoalModel.fromEntity(entity));
  }

  async findOneByUser(id: string, userId: string): Promise<GoalModel> {
    const goal = await this.findEntityByUser(id, userId);
    return GoalModel.fromEntity(goal);
  }

  async create(userId: string, data: CreateGoalDto): Promise<GoalModel> {
    const goal = this.goalsRepo.create({ ...data, user_id: userId, current_amount: 0 });
    const saved = await this.goalsRepo.save(goal);
    return GoalModel.fromEntity(saved);
  }

  async update(id: string, userId: string, data: UpdateGoalDto): Promise<GoalModel> {
    const goal = await this.findEntityByUser(id, userId);
    this.goalsRepo.merge(goal, data);
    const saved = await this.goalsRepo.save(goal);
    return GoalModel.fromEntity(saved);
  }

  async contribute(id: string, userId: string, amount: number): Promise<GoalModel> {
    const goal = await this.findEntityByUser(id, userId);
    goal.current_amount = Number(goal.current_amount) + amount;
    if (goal.current_amount >= Number(goal.target_amount)) {
      goal.is_completed = true;
    }
    const saved = await this.goalsRepo.save(goal);
    return GoalModel.fromEntity(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findEntityByUser(id, userId);
    await this.goalsRepo.remove(goal);
  }
}
