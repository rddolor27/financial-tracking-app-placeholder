import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statement } from './statement.entity';
import { StatementsService } from './statements.service';
import { StatementsController } from './statements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Statement])],
  controllers: [StatementsController],
  providers: [StatementsService],
  exports: [StatementsService],
})
export class StatementsModule {}
