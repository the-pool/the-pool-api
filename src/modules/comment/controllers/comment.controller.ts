import { Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COMMENT_MODEL_NAME_MAPPER } from '@src/constants/constant';
import { ModelName } from '@src/constants/enum';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { SetModelNameToParamByDomain } from '@src/decorators/set-model-name-to-param-by-domain.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { CommentService } from '../services/comment.service';

@ApiTags('댓글')
@Controller(':id/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  async createComment(
    @Param()
    @SetModelNameToParamByDomain()
    param: IdRequestParamDto,
  ) {
    const commentModel = COMMENT_MODEL_NAME_MAPPER[param.model];

    this.commentService.createComment(param.id, commentModel);
  }
}
