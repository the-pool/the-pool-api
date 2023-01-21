import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateLessonDto } from '../dtos/lesson/create-lesson.dto';
import { ReadOneLessonDto } from '../dtos/lesson/read-one-lesson.dto';
import { ReadSimilarLessonDto } from '../dtos/lesson/read-similar-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/lesson/similar-lesson-query.dto';
import { UpdateLessonDto } from '../dtos/lesson/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';
import {
  ApiCreateLesson,
  ApiDeleteLesson,
  ApiReadOneLesson,
  ApiReadSimilarLesson,
  ApiUpdateLesson,
} from '../swaggers/lesson.swagger';

@ApiTags('과제')
@Controller()
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateLesson('과제 생성')
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lesson: LessonEntity }> {
    const lesson = await this.lessonService.createLesson(
      createLessonDto,
      memberId,
    );

    return { lesson };
  }

  @ApiUpdateLesson('과제 수정')
  @BearerAuth(JwtAuthGuard)
  @Put(':id')
  async updateLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() updateLessonDto: UpdateLessonDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lesson: LessonEntity }> {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const updatedLesson = await this.lessonService.updateLesson(
      updateLessonDto,
      param.id,
    );

    return { lesson: updatedLesson };
  }

  @ApiDeleteLesson('과제 삭제')
  @BearerAuth(JwtAuthGuard)
  @Delete(':id')
  async deleteLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lesson: LessonEntity }> {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const deletedLesson = await this.lessonService.deleteLesson(param.id);

    return { lesson: deletedLesson };
  }

  @ApiReadOneLesson('과제 상세 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':id')
  async readOneLesson(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @UserLogin() member: Member | { id: null },
  ): Promise<{ lesson: ReadOneLessonDto }> {
    const readOneLesson = await this.lessonService.readOneLesson(
      param.id,
      member.id,
    );
    const lesson = plainToInstance(ReadOneLessonDto, readOneLesson);

    return { lesson };
  }

  @ApiReadSimilarLesson('과제 상세 조회의 유사과제')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':id/similarity')
  async readSimilarLesson(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Query() query: SimilarLessonQueryDto,
    @UserLogin() member: Member | { id: null },
  ): Promise<ReadSimilarLessonDto> {
    const readSimilarLessons = await this.lessonService.readSimilarLesson(
      param.id,
      member.id,
      query,
    );

    return plainToInstance(ReadSimilarLessonDto, {
      lessons: readSimilarLessons,
    });
  }

  @ApiReadOneLesson('과제 목록 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyLesson(@Query() query: any) {
    console.log(query);
  }
}
