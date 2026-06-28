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
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  type CreateCategoryDto,
  CreateCategorySchema,
  type UpdateCategoryDto,
  UpdateCategorySchema,
} from './dtos';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    @InjectCategoriesService() private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.categoriesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.categoriesService.findOneForUser(id, req.user.id);
  }

  @Post()
  async create(
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(CreateCategorySchema)) body: CreateCategoryDto,
  ) {
    return this.categoriesService.create(req.user.id, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
    @Body(new ZodValidationPipe(UpdateCategorySchema)) body: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    await this.categoriesService.remove(id, req.user.id);
  }
}
