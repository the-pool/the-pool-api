import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';

@ApiTags('과제')
@Controller('api/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiOperation({ summary: '과제 생성' })
  @ApiCreatedResponse({ type: LessonEntity })
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    return this.lessonService.createLesson(createLessonDto, memberId);
  }

  @Put(':id')
  @ApiOperation({ summary: '과제 수정' })
  @ApiCreatedResponse({ type: LessonEntity })
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateLesson(
    @Param()
    @SetModelNameToParam(ModelName.LessonHashTag)
    param: IdRequestParamDto,
    @Body() { hashtag, ...lesson }: UpdateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    // lesson 테이블 업데이트
    await this.lessonService.updateLesson(lesson, memberId, param.id);
    // hashtag가 있다면 기존 lesson의 hashtag삭제하고, 새로운 hashtag 저장
    await this.lessonService.updateLessonHashTag(hashtag, param.id);
  }
}
