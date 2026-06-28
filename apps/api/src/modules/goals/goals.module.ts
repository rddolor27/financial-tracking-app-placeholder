import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { GoalsController } from './goals.controller';
import { GoalsProvider } from './goals.providers';
import { GOALS_SERVICE } from './goals.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [GoalsController],
  providers: [GoalsProvider],
  exports: [GOALS_SERVICE],
})
export class GoalsModule {}
