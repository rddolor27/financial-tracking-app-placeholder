import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statement } from './statement.entity';
import { StatementsController } from './statements.controller';
import { StatementsProvider } from './statements.providers';
import { STATEMENTS_SERVICE } from './statements.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Statement])],
  controllers: [StatementsController],
  providers: [StatementsProvider],
  exports: [STATEMENTS_SERVICE],
})
export class StatementsModule {}
