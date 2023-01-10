import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberInterestEntity } from '@src/modules/member/entities/member-interest.entity';

@Injectable()
export class MemberInterestService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @todo 우선 orderBy 고정해놨지만 추후에 orderBy 도 클라이언트에서 받아서 처리하는것도 고려
   *
   * member-interest 리스트 조회
   */
  async findAll(
    memberId?: number,
  ): Promise<{ memberInterests: MemberInterestEntity[] }> {
    let where: Prisma.MemberSkillWhereInput | undefined = undefined;

    if (memberId) {
      where = {
        memberSkillMappings: {
          some: {
            memberId,
          },
        },
      };
    }

    const memberInterests: MemberInterestEntity[] =
      await this.prismaService.memberInterest.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
      });

    return { memberInterests };
  }
}
