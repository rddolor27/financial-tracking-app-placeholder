import {
  Controller, Get, Post, Delete, Param,
  UseGuards, Req, HttpCode, HttpStatus,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { StatementsService } from './statements.service';
import { InjectStatementsService } from './statements.providers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('statements')
@UseGuards(JwtAuthGuard)
export class StatementsController {
  constructor(
    @InjectStatementsService() private readonly statementsService: StatementsService,
  ) {}

  @Get()
  async findAll(@Req() req: { user: { id: string } }) {
    return this.statementsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.statementsService.findOneByUser(id, req.user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Req() req: { user: { id: string } },
    @UploadedFile() file: { originalname: string; path: string; size: number },
  ) {
    return this.statementsService.create(req.user.id, {
      file_name: file.originalname,
      file_url: file.path,
      file_size: file.size,
      statement_type: 'bank',
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    await this.statementsService.remove(id, req.user.id);
  }
}
