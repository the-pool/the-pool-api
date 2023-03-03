import { Injectable } from '@nestjs/common';
import { ModelName } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaCommentModelName, PrismaModelName } from '@src/types/type';

// 공통 service 방식으로 진행하다가 여차 하면 di 할 수있는 형태로 바꾸기
// crete 때문에 di 하는 형태로 넘어가야 할듯.. 각각의 model의 프로퍼티 이름까지 가져오기 너무 힘들다
// 아마 controller는 하나로 공유해도 문제 없을 듯
@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(parentId: number, commentModel: PrismaCommentModelName) {
    // @ts-ignore
    return this.prismaService[commentModel].create({ data: {} });
  }
}
