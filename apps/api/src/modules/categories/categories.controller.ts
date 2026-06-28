import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { CategoriesService } from './categories.service';
import { InjectCategoriesService } from './categories.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryModel } from './models/category.model';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    @InjectCategoriesService() private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }): Promise<CategoryModel[]> {
    return this.categoriesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<CategoryModel> {
    return this.categoriesService.findOneForUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body() body: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return this.categoriesService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body() body: UpdateCategoryDto,
  ): Promise<CategoryModel> {
    return this.categoriesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<void> {
    await this.categoriesService.remove(id, req.user.id);
  }
}
