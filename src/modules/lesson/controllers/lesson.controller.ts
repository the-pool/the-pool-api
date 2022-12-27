import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { CustomApiResponse } from '@src/decorators/custom-api-response.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { NotFoundErrorFilter } from '@src/filters/not-found-error.filter';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { plainToInstance } from 'class-transformer';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { ReadSimilarLessonDto } from '../dtos/read-similar-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';

@ApiTags('과제')
@Controller()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @ApiOperation({ summary: '과제 생성' })
  @ApiCreatedResponse({ type: OmitType(LessonEntity, ['hashtags']) })
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @BearerAuth(JwtAuthGuard)
  @Post()
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<Omit<LessonEntity, 'hashtag'>> {
    return this.lessonService.createLesson(createLessonDto, memberId);
  }

  @ApiOperation({ summary: '과제 수정' })
  @ApiOkResponse({ type: OmitType(LessonEntity, ['hashtags']) })
  @CustomApiResponse(HttpStatus.NOT_FOUND, 'No Lesson found')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Put(':id')
  updateLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() updateLessonDto: UpdateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<Omit<LessonEntity, 'hashtag'>> {
    return this.lessonService.updateLesson(updateLessonDto, memberId, param.id);
  }

  @ApiOperation({ summary: '과제 삭제' })
  @ApiOkResponse({ type: OmitType(LessonEntity, ['hashtags']) })
  @CustomApiResponse(HttpStatus.NOT_FOUND, 'No Lesson found')
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @BearerAuth(JwtAuthGuard)
  @UseFilters(NotFoundErrorFilter)
  @Delete(':id')
  deleteLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<Omit<LessonEntity, 'hashtag'>> {
    return this.lessonService.deleteLesson(memberId, param.id);
  }

  @ApiOperation({ summary: '과제 상세 조회' })
  @ApiOkResponse({ type: ReadOneLessonDto })
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in lesson",
  )
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':id')
  readOneLesson(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @UserLogin() member: Member,
  ): ReadOneLessonDto {
    const lesson = this.lessonService.readOneLesson(param.id, member.id);

    return plainToInstance(ReadOneLessonDto, lesson);
  }

  @ApiOperation({ summary: '과제 상세 조회의 유사과제' })
  @ApiOkResponse({ type: ReadSimilarLessonDto })
  @CustomApiResponse(
    HttpStatus.NOT_FOUND,
    "(과제 번호) doesn't exist id in Lesson",
  )
  @CustomApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, '서버 에러')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':id/similarity')
  async readSimilarLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Query() query: SimilarLessonQueryDto,
    @UserLogin() member: Member,
  ): Promise<ReadSimilarLessonDto> {
    const lessons = await this.lessonService.readSimilarLesson(
      param.id,
      member.id,
      query,
    );

    return plainToInstance(ReadSimilarLessonDto, {
      lessons,
    });
  }
}
