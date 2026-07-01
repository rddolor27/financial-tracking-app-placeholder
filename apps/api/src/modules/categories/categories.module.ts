import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesProvider } from './categories.service';
import { CATEGORIES_SERVICE } from './categories.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesProvider],
  exports: [CATEGORIES_SERVICE],
})
export class CategoriesModule {}
