import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonBookmarkService } from '../services/lesson-bookmark.service';
import { ApiCreateBookmark } from '../swaggers/lesson-bookmark.swagger';

@ApiTags('과제 북마크')
@Controller(':id/bookmark')
export class LessonBookmarkController {
  constructor(
    private readonly lessonBookmarkService: LessonBookmarkService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateBookmark('과제 북마크 생성')
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createBookmark(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ) {
    await this.prismaService.validateDuplicateAndFail(
      ModelName.LessonBookmark,
      {
        memberId,
        lessonId: param.id,
      },
    );

    const lessonBookmark = await this.lessonBookmarkService.createBookmark(
      param.id,
      memberId,
    );
    return { lessonBookmark };
  }

  @BearerAuth(JwtAuthGuard)
  @Delete()
  async deleteBookmark(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ) {
    return this.lessonBookmarkService.deleteBookmark(param.id, memberId);
  }
}
