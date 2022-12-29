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
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { plainToInstance } from 'class-transformer';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { ReadOneLessonDto } from '../dtos/read-one-lesson.dto';
import { ReadSimilarLessonDto } from '../dtos/read-similar-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';

@ApiTags('과제')
@Controller()
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  @ApiOperation({ summary: '과제 생성' })
  @BearerAuth(JwtAuthGuard)
  @ApiSuccessResponse(HttpStatus.CREATED, {
    field: 'lesson',
    type: OmitType(LessonEntity, ['hashtags']),
  })
  @Post()
  async createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lesson: Omit<LessonEntity, 'hashtags'> }> {
    const lesson = await this.lessonService.createLesson(
      createLessonDto,
      memberId,
    );

    return { lesson };
  }

  @ApiOperation({ summary: '과제 수정' })
  @ApiSuccessResponse(HttpStatus.OK, {
    field: 'lesson',
    type: OmitType(LessonEntity, ['hashtags']),
  })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, 'You do not have access to ~')
  @ApiFailureResponse(HttpStatus.NOT_FOUND, "~ doesn't exist id in ~")
  @BearerAuth(JwtAuthGuard)
  @Put(':id')
  async updateLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() updateLessonDto: UpdateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lesson: Omit<LessonEntity, 'hashtag'> }> {
    await this.prismaHelper.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const updatedLesson = await this.lessonService.updateLesson(
      updateLessonDto,
      param.id,
    );

    return { lesson: updatedLesson };
  }

  @ApiOperation({ summary: '과제 삭제' })
  @ApiSuccessResponse(HttpStatus.OK, {
    field: 'lesson',
    type: OmitType(LessonEntity, ['hashtags']),
  })
  @ApiFailureResponse(HttpStatus.FORBIDDEN, 'You do not have access to ~')
  @ApiFailureResponse(HttpStatus.NOT_FOUND, "~ doesn't exist id in ~")
  @BearerAuth(JwtAuthGuard)
  @Delete(':id')
  async deleteLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lesson: Omit<LessonEntity, 'hashtag'> }> {
    await this.prismaHelper.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });
    const deletedLesson = await this.lessonService.deleteLesson(param.id);
    return { lesson: deletedLesson };
  }

  @ApiOperation({ summary: '과제 상세 조회' })
  @ApiOkResponse({ type: ReadOneLessonDto })
  @ApiFailureResponse(HttpStatus.NOT_FOUND, "~ doesn't exist id in ~")
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
  @ApiFailureResponse(HttpStatus.NOT_FOUND, "~ doesn't exist id in ~")
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
