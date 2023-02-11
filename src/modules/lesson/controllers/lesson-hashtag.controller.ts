import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateManyLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/create-many-lesson-hashtag.dto';
import { UpdateManyLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/update-many-lesson-hashtag.dto';
import { LessonHashtagParamDto } from '@src/modules/lesson/dtos/hashtag/lesson-hashtag-param.dto';
import { LessonHashtagService } from '../services/lesson-hashtag.service';
import {
  ApiCreateManyHashtag,
  APiDeleteManyHashtag,
  ApiReadManyHashtag,
  ApiUpdateManyHashtag,
} from '../swaggers/lesson-hashtag.swagger';
import { ReadLessonHashtagDto } from '../dtos/hashtag/read-many-lesson-hashtag.dto';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { LessonHashtagMapping } from '@prisma/client';

@ApiTags('과제의 해시태그')
@Controller(':id/hashtags')
export class LessonHashtagController {
  constructor(
    private readonly lessonHashtagService: LessonHashtagService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateManyHashtag('과제 해시태그 생성')
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { lessonHashtagIds }: CreateManyLessonHashtagDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonHashtags: ReadLessonHashtagDto[] }> {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const lessonHashtags = await this.lessonHashtagService.createManyHashtag(
      lessonHashtagIds,
      param.id,
    );

    return { lessonHashtags };
  }

  @ApiUpdateManyHashtag('과제 해시태그 수정')
  @BearerAuth(JwtAuthGuard)
  @Put()
  async updateManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { lessonHashtagIds }: UpdateManyLessonHashtagDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonHashtags: ReadLessonHashtagDto[] }> {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const lessonHashtags = await this.lessonHashtagService.updateManyHashtag(
      lessonHashtagIds,
      param.id,
    );

    return { lessonHashtags };
  }

  @APiDeleteManyHashtag('과제 해시태그 삭제')
  @BearerAuth(JwtAuthGuard)
  @Delete(':lessonHashtagIds')
  async deleteManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ count: number }> {
    await Promise.all([
      this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
        id: param.id,
        memberId,
      }),
      this.prismaService.validateMappedDataOrFail<LessonHashtagMapping>(
        ModelName.LessonHashtagMapping,
        { lessonId: param.id, lessonHashtagId: { in: param.lessonHashtagIds } },
      ),
    ]);

    return this.lessonHashtagService.deleteManyHashtagByHashtagId(
      param.id,
      param.lessonHashtagIds,
    );
  }

  @ApiReadManyHashtag('과제의 해시태그 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
  ): Promise<{ lessonHashtags: ReadLessonHashtagDto[] }> {
    const lessonHashtags = await this.lessonHashtagService.readManyHashtag(
      param.id,
    );

    return { lessonHashtags };
  }

  /**
   * @todo 과제 해시태그에 들어갈 수 있는 해시태그 목록 조회 api 생성
   */
}
