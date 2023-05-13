import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LessonLike } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonLikeEntity } from '@src/modules/lesson/entities/lesson-like.entity';
import { LessonLikeService } from '@src/modules/lesson/services/lesson-like.service';
import {
  ApiCreateLike,
  ApiDeleteLike,
} from '@src/modules/lesson/swaggers/lesson-like.swagger';
import { MemberStatus } from '@src/modules/member/constants/member.enum';

@ApiTags('과제 좋아요')
@Controller(':id/likes')
export class LessonLikeController {
  constructor(
    private readonly lessonLikeService: LessonLikeService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiCreateLike('과제 좋아요 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createLike(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonLike: LessonLikeEntity }> {
    await this.prismaService.validateMappedDataOrFail<LessonLike>(
      ModelName.LessonLike,
      {
        memberId,
        lessonId: { in: [param.id] },
      },
      false,
    );

    const lessonLike = await this.lessonLikeService.createLike(
      param.id,
      memberId,
    );

    return { lessonLike };
  }

  @ApiDeleteLike('과제 좋아요 삭제')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Delete()
  async deleteLike(
    @Param()
    @SetModelNameToParam(ModelName.Lesson)
    param: IdRequestParamDto,
    @UserLogin('id') memberId: number,
  ): Promise<{ lessonLike: LessonLikeEntity }> {
    await this.prismaService.validateMappedDataOrFail<LessonLike>(
      ModelName.LessonLike,
      { memberId, lessonId: { in: [param.id] } },
      true,
    );

    const lessonLike = await this.lessonLikeService.deleteLike(
      param.id,
      memberId,
    );

    return { lessonLike };
  }
}
