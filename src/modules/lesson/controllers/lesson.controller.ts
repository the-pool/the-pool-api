import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { LessonService } from '../services/lesson.service';
import { CreateLessonResponseType } from '../types/response/create-lesson-response.type';

@ApiTags('과제')
@Controller('api/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiOperation({ summary: '과제 생성' })
  @ApiCreatedResponse({ type: CreateLessonResponseType })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    return this.lessonService.createLesson(createLessonDto, memberId);
  }
}
