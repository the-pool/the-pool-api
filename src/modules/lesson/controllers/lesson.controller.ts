import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { plainToInstance } from 'class-transformer';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';
import { ReadOneLessonResponseType } from '../types/response/read-one-lesson-response.type';

@ApiTags('과제')
@Controller('api/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '과제 생성' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LessonEntity })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<LessonEntity> {
    return this.lessonService.createLesson(createLessonDto, memberId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '과제 수정' })
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiFailureResponse(HttpStatus.FORBIDDEN, '과제를 수정할 권한이 없습니다.')
  @ApiFailureResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in lesson",
  )
  async updateLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtag, ...lesson }: UpdateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    await Promise.all([
      this.lessonService.updateLesson(lesson, memberId, param.id),
      this.lessonService.updateLessonHashtag(hashtag, param.id),
    ]);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '과제 상세 조회' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReadOneLessonResponseType })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiFailureResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in lesson",
  )
  readOneLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin() member: Member,
  ): ReadOneLessonResponseType {
    const lesson = this.lessonService.readOneLesson(param.id, member.id);

    return plainToInstance(ReadOneLessonResponseType, lesson);
  }
}
