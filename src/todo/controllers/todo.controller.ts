import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateSituationDto } from '../dto/create-situation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Situation } from '../entities/situation.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSituation(
    @Body() createSituationDto: CreateSituationDto,
    @Req() req: any,
  ): Promise<{ situationId: string }> {
    const userId = req.user.uid;
    const situationId = await this.todoService.createSituation(
      createSituationDto,
      userId,
    );

    return { situationId };
  }

  @Get(':id')
  async getSituation(@Param('id') situationId: string): Promise<Situation> {
    return await this.todoService.getSituation(situationId);
  }
}
