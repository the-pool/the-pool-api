import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

@Injectable()
export class MemberFriendshipService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
  ) {}

  async findAll(
    query: FindMemberFriendshipListQueryDto,
    target: 'follower' | 'following',
  ): Promise<{
    followers: MemberEntity[];
    followings: MemberEntity[];
    totalCount: number;
  }> {
    const { page, pageSize, orderBy, sortBy, memberId } = query;

    // 정렬 옵션 build
    const order = this.queryHelper.buildOrderByPropForFind({
      [sortBy]: orderBy,
    });
    // follower or following 만 select
    const select: Prisma.MemberFollowSelect = {
      [target]: true,
    };
    // follower or following 일 때 where 조건 분기
    const where: Prisma.MemberFollowWhereInput = {
      followerId: target === 'following' ? memberId : undefined,
      followingId: target === 'follower' ? memberId : undefined,
    };

    // 프로미스한 findMany 만 만들어놓는다.
    const friendshipsQuery = this.prismaService.memberFollow.findMany({
      select,
      where,
      orderBy: order,
      skip: page * pageSize,
      take: pageSize,
    }) as PrismaPromise<
      {
        follower: MemberEntity;
        following: MemberEntity;
      }[]
    >;

    // 프로미스한 count 만 만들어놓는다.
    const totalCountQuery: PrismaPromise<number> =
      this.prismaService.memberFollow.count({
        where,
        orderBy: order,
      });

    // transaction 을 통해 한번에 처리
    const [friendships, totalCount] = await this.prismaService.$transaction([
      friendshipsQuery,
      totalCountQuery,
    ]);

    // 뽑아온 follow 정보를 후처리 해준다.
    const followers: MemberEntity[] = friendships.map((friendship) => {
      return friendship.follower;
    });
    const followings: MemberEntity[] = friendships.map((friendship) => {
      return friendship.following;
    });

    return { followers, followings, totalCount };
  }
}
