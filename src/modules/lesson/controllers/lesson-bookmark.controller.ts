import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LessonBookmark } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { LessonBookmarkEntity } from '../entities/lesson-bookmark.entity';
import { LessonBookmarkService } from '../services/lesson-bookmark.service';
import {
  ApiCreateBookmark,
  ApiDeleteBookmark,
} from '../swaggers/lesson-bookmark.swagger';

@ApiTags('과제 북마크')
@Controller(':id/bookmarks')
export class LessonBookmarkController {
  constructor(
    private readonly lessonBookmarkService: LessonBookmarkService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateBookmark('과제 북마크 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createBookmark(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonBookmark: LessonBookmarkEntity }> {
    await this.prismaService.validateMappedDataOrFail<LessonBookmark>(
      ModelName.LessonBookmark,
      {
        memberId,
        lessonId: { in: [param.id] },
      },
      false,
    );

    const lessonBookmark = await this.lessonBookmarkService.createBookmark(
      param.id,
      memberId,
    );
    return { lessonBookmark };
  }

  @ApiDeleteBookmark('과제 북마크 삭제')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Delete()
  async deleteBookmark(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonBookmark: LessonBookmarkEntity }> {
    await this.prismaService.validateMappedDataOrFail<LessonBookmark>(
      ModelName.LessonBookmark,
      {
        memberId,
        lessonId: { in: [param.id] },
      },
      true,
    );

    const lessonBookmark = await this.lessonBookmarkService.deleteBookmark(
      param.id,
      memberId,
    );
    return { lessonBookmark };
  }
}
