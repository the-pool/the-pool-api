import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberInterestEntity } from '@src/modules/member-interest/entities/member-interest.entity';

@Injectable()
export class MemberInterestService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @todo 우선 orderBy 고정해놨지만 추후에 orderBy 도 클라이언트에서 받아서 처리하는것도 고려
   *
   * member-interest 리스트 조회
   */
  findAll(memberId?: number): Promise<MemberInterestEntity[]> {
    let where: Prisma.MemberInterestWhereInput | undefined = undefined;

    // 특정 멤버에 대한 관심사만 조회 할 경우 where 조건을 만들어준다.
    if (memberId) {
      where = {
        memberInterestMappings: {
          some: {
            memberId,
          },
        },
      };
    }

    return this.prismaService.memberInterest.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
    });
  }
}
