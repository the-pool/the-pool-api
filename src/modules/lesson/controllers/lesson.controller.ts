import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
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
  @CustomApiResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    '길이가 맞지 않아 createMany를 실행할 수 없습니다.',
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    return this.lessonService.createLesson(createLessonDto, memberId);
  }
}
