import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
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
  ApiUpdateManyHashtag,
} from '../swaggers/lesson-hashtag.swagger';
import { ReadLessonHashtagDto } from '../dtos/hashtag/read-many-lesson-hashtag.dto';
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

    const createdLessonHashtags =
      await this.lessonHashtagService.createManyHashtag(
        lessonHashtagIds,
        param.id,
      );

    return { lessonHashtags: createdLessonHashtags };
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

    const updatedLessonHashtags =
      await this.lessonHashtagService.updateManyHashtag(
        lessonHashtagIds,
        param.id,
      );

    return { lessonHashtags: updatedLessonHashtags };
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
      this.prismaService.validateMappedData(
        ModelName.LessonHashtagMapping,
        {
          lessonId: param.id,
          lessonHashtagId: { in: param.lessonHashtagIds },
        },
        param.lessonHashtagIds.length,
      ),
    ]);

    return this.lessonHashtagService.deleteManyHashtagByHashtagId(
      param.id,
      param.lessonHashtagIds,
    );
  }

  // @ApiReadManyHashtag('과제의 해시태그 조회')
  // @BearerAuth(OptionalJwtAuthGuard)
  // @Get()
  // async readManyHashtag(
  //   @Param()
  //   @SetModelNameToParam(ModelName.Lesson)
  //   param: IdRequestParamDto,
  // ) {
  //   const hashtags = await this.lessonHashtagService.readManyHashtag(param.id);

  //   return { hashtags };
  // }

  // @ApiReadOneHashtag('과제의 해시태그 단일 조회')
  // @BearerAuth(OptionalJwtAuthGuard)
  // @Get(':hashtagId')
  // async readOneHashtag(
  //   @Param()
  //   @SetModelNameToParam(ModelName.Lesson)
  //   param: LessonHashtagParamDto,
  // ): Promise<{ hashtag: LessonHashtagEntity | null }> {
  //   await this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
  //     id: param.hashtagId,
  //     lessonId: param.id,
  //   });

  //   const hashtag = await this.lessonHashtagService.readOneHashtag(
  //     param.hashtagId,
  //   );

  //   return { hashtag };
  // }
}
