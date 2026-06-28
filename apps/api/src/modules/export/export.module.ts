import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportController } from './export.controller';
import { ExportProvider } from './export.providers';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [ExportController],
  providers: [ExportProvider],
})
export class ExportModule {}
