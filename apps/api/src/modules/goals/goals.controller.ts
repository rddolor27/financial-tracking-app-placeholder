import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { GoalsService } from './goals.service';
import { InjectGoalsService } from './goals.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  type CreateGoalDto,
  CreateGoalSchema,
  type UpdateGoalDto,
  UpdateGoalSchema,
  type ContributeGoalDto,
  ContributeGoalSchema,
} from './dtos';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(
    @InjectGoalsService() private readonly goalsService: GoalsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.goalsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.goalsService.findOneByUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(CreateGoalSchema)) body: CreateGoalDto,
  ) {
    return this.goalsService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(UpdateGoalSchema)) body: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, req.user.id, body);
  }

  @Post(':id/contribute')
  async contribute(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(ContributeGoalSchema)) body: ContributeGoalDto,
  ) {
    return this.goalsService.contribute(id, req.user.id, body.amount);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    await this.goalsService.remove(id, req.user.id);
  }
}
