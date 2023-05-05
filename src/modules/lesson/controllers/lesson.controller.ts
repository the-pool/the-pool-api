import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateLessonDto } from '../dtos/lesson/create-lesson.dto';
import { ReadManyLessonQueryDto } from '../dtos/lesson/read-many-lesson-query.dto';
import { ReadManyLessonDto } from '../dtos/lesson/read-many-lesson.dto';
import { ReadOneLessonDto } from '../dtos/lesson/read-one-lesson.dto';
import { UpdateLessonDto } from '../dtos/lesson/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';
import {
  ApiCreateLesson,
  ApiDeleteLesson,
  ApiReadManyLesson,
  ApiReadOneLesson,
  ApiUpdateLesson,
} from '@src/modules/lesson/swaggers/lesson.swagger';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { plainToClass } from 'class-transformer';

@ApiTags('과제')
@Controller()
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateLesson('과제 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
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
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
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

    const deletedLesson = await this.lessonService.deleteLesson(
      memberId,
      param.id,
    );

    return { lesson: deletedLesson };
  }

  @ApiReadManyLesson('과제 목록 조회')
  @Get()
  readManyLesson(
    @Query() query: ReadManyLessonQueryDto,
  ): Promise<{ lessons: ReadManyLessonDto[]; totalCount: number }> {
    return this.lessonService.readManyLesson(query);
  }

  @ApiReadOneLesson('과제 상세 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':id')
  async readOneLesson(
    @Param() @SetModelNameToParam(ModelName.Lesson) param: IdRequestParamDto,
    @UserLogin() member: Member | { id: null },
  ): Promise<{ lesson: ReadOneLessonDto }> {
    const lesson = await this.lessonService.readOneLesson(param.id, member.id);

    return { lesson };
  }
}
