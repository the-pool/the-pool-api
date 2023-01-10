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

    const order = this.queryHelper.buildOrderByPropForFind([orderBy], [sortBy]);
    const select: Prisma.MemberFollowSelect = {
      [target]: true,
    };
    const where: Prisma.MemberFollowWhereInput = {
      followerId: target === 'following' ? memberId : undefined,
      followingId: target === 'follower' ? memberId : undefined,
    };

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

    const totalCountQuery: PrismaPromise<number> =
      this.prismaService.memberFollow.count({
        where,
        orderBy: order,
      });

    const [friendships, totalCount] = await this.prismaService.$transaction([
      friendshipsQuery,
      totalCountQuery,
    ]);

    const followers: MemberEntity[] = friendships.map((friendship) => {
      return friendship.follower;
    });
    const followings: MemberEntity[] = friendships.map((friendship) => {
      return friendship.following;
    });

    return { followers, followings, totalCount };
  }
}
