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
import { ReadOneLessonResponseType } from '../types/response/read-one-lesson-response.type';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { Member } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

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
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
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
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(HttpStatus.FORBIDDEN, '과제를 수정할 권한이 없습니다.')
  @CustomApiResponse(
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
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(
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

  // 해당 유사 과제에 북마크 여부를 보여 주어야 하기 때문에 토큰을 받아야 한다.
  @Get(':id/similarity')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '과제 상세 조회의 유사과제' })
  @ApiBearerAuth()
  // @ApiOkResponse({type:ReadSimilarLessonResponseType})
  @CustomApiResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in Lesson",
  )
  readSimilarLesson(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @UserLogin() member: Member,
  ) {
    const similarLessons = this.lessonService.readSimilarLesson(
      param.id,
      member.id,
    );

    return similarLessons;
  }
}
