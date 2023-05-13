import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { ApiCreateManySolutionHashtag } from '@src/modules/solution/controllers/solution-hashtag.controller.swagger';
import { CreateSolutionHashtagsRequestBodyDto } from '@src/modules/solution/dtos/create-solution-hashtags-request-body.dto';
import { SolutionHashtagEntity } from '@src/modules/solution/entities/solution-hashtag.entity';
import { SolutionHashtagService } from '@src/modules/solution/services/solution-hashtag.service';

@ApiTags('문제-풀이의 해시태그')
@Controller()
export class SolutionHashtagController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly solutionHashtagService: SolutionHashtagService,
  ) {}

  @ApiCreateManySolutionHashtag('문제-풀이 해시태그 추가')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @UseGuards(JwtAuthGuard)
  @Post(':id/hashtags')
  async createManyHashtag(
    @Param('id') solutionId: number,
    @Body() requestBody: CreateSolutionHashtagsRequestBodyDto,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionHashtagEntity[]> {
    await this.prismaService.validateOwnerOrFail(ModelName.LessonSolution, {
      id: solutionId,
      memberId,
    });

    return this.solutionHashtagService.createManyHashtag(
      requestBody,
      solutionId,
    );
  }
}
