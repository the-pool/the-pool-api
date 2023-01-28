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
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateManyLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/create-many-lesson-hashtag.dto';
import { UpdateOneLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/update-one-lesson-hashtag.dto';
import { UpdateManyLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/update-many-lesson-hashtag.dto';
import { LessonHashtagParamDto } from '@src/modules/lesson/dtos/hashtag/lesson-hashtag-param.dto';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
import { LessonHashtagService } from '../services/lesson-hashtag.service';
import {
  ApiCreateManyHashtag,
  APiDeleteOneHashtag,
  ApiReadManyHashtag,
  ApiReadOneHashtag,
  ApiUpdateManyHashtag,
  ApiUpdateOneHashtag,
} from '../swaggers/lesson-hashtag.swagger';

@ApiTags('과제의 해시태그')
@Controller(':id/hashtags')
export class LessonHashtagController {
  constructor(
    private readonly lessonHashtagService: LessonHashtagService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateManyHashtag('과제 해시태그 대량 생성')
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: CreateManyLessonHashtagDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const createdHashtags = await this.lessonHashtagService.createManyHashtag(
      hashtags,
      param.id,
    );

    return { hashtags: createdHashtags };
  }

  @ApiUpdateManyHashtag('과제 해시태그 대량 수정')
  @BearerAuth(JwtAuthGuard)
  @Put()
  async updateManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @Body() { hashtags }: UpdateManyLessonHashtagDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
      id: param.id,
      memberId,
    });

    const updatedHashtags = await this.lessonHashtagService.updateManyHashtag(
      hashtags,
      param.id,
    );

    return { hashtags: updatedHashtags };
  }

  @ApiUpdateOneHashtag('과제 해시태그 단일 수정')
  @BearerAuth(JwtAuthGuard)
  @Put(':hashtagId')
  async updateOneHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
    @Body() { hashtag }: UpdateOneLessonHashtagDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ hashtag: LessonHashtagEntity }> {
    await Promise.all([
      this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
        id: param.id,
        memberId,
      }),
      this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
        id: param.hashtagId,
        lessonId: param.id,
      }),
    ]);

    const updatedHashtag = await this.lessonHashtagService.updateOneHashtag(
      param.hashtagId,
      hashtag,
    );

    return { hashtag: updatedHashtag };
  }

  @APiDeleteOneHashtag('과제 해시태그 단일 삭제')
  @BearerAuth(JwtAuthGuard)
  @Delete(':hashtagId')
  async deleteOneHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ hashtag: LessonHashtagEntity }> {
    await Promise.all([
      this.prismaService.validateOwnerOrFail(ModelName.Lesson, {
        id: param.id,
        memberId,
      }),
      this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
        id: param.hashtagId,
        lessonId: param.id,
      }),
    ]);

    const deletedHashtag = await this.lessonHashtagService.deleteOneHashtag(
      param.hashtagId,
    );

    return { hashtag: deletedHashtag };
  }

  @ApiReadManyHashtag('과제의 해시태그 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get()
  async readManyHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
  ) {
    const hashtags = await this.lessonHashtagService.readManyHashtag(param.id);

    return { hashtags };
  }

  @ApiReadOneHashtag('과제의 해시태그 단일 조회')
  @BearerAuth(OptionalJwtAuthGuard)
  @Get(':hashtagId')
  async readOneHashtag(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: LessonHashtagParamDto,
  ): Promise<{ hashtag: LessonHashtagEntity | null }> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonHashtag, {
      id: param.hashtagId,
      lessonId: param.id,
    });

    const hashtag = await this.lessonHashtagService.readOneHashtag(
      param.hashtagId,
    );

    return { hashtag };
  }
}
