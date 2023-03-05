import { Injectable } from '@nestjs/common';
import {
  COMMENT_COLUMN_NAME_MAPPER,
  COMMENT_MODEL_NAME_MAPPER,
} from '@src/constants/constant';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaCommentModelName, PrismaModelName } from '@src/types/type';

/**
 * 해당 파일에서만 쓰이는 타입
 */
type SettedCommentParams = {
  commentModel: PrismaCommentModelName;
  commentColumn: Partial<Record<`${PrismaModelName}Id`, number>>;
};

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  createComment(
    { commentModel, commentColumn }: SettedCommentParams,
    memberId: number,
    description: string,
  ) {
    // @ts-ignore
    return this.prismaService[commentModel].create({
      // @ts-ignore
      data: { memberId: memberId, ...commentColumn, description },
    });
  }
  // model Name, model id로 변경해야 할수도
  setCommentParams({
    id: modelId,
    model: modelName,
  }: IdRequestParamDto): SettedCommentParams {
    /// 도메인에 연결된 댓글 테이블 이름
    const commentModel: PrismaCommentModelName =
      COMMENT_MODEL_NAME_MAPPER[modelName];
    /// 도메인에 해당하는 댓글 테이블에 필요한 컬럼
    const commentColumn: Partial<Record<`${PrismaModelName}Id`, number>> = {
      [COMMENT_COLUMN_NAME_MAPPER[modelName]]: modelId,
    };

    return { commentModel, commentColumn };
  }
}
