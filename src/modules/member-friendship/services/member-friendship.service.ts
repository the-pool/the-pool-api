import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
import { MemberFollowEntity } from '@src/modules/member-friendship/entities/member-follow.entity';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
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

  /**
   * member follow
   */
  async createFollowing(
    followingMemberId: number,
    followerMemberId: number,
  ): Promise<MemberFollowEntity> {
    // following 할 멤버를 가져온다.
    const followerMember: MemberEntity | null =
      await this.prismaService.member.findUnique({
        where: {
          id: followerMemberId,
        },
      });

    // following 할 멤버가 없는 멤버일 경우
    if (!followerMember) {
      throw new NotFoundException('following 할 멤버가 존재하지 않습니다.');
    }

    // following 할 멤버가 active 상태가 아닌 경우
    if (followerMember.status !== MemberStatus.Active) {
      throw new ForbiddenException('following 할 멤버가 활성 상태가 아닙니다.');
    }

    // 팔로우 정보를 가져온다.
    const oldMemberFollow: MemberFollowEntity | null =
      await this.prismaService.memberFollow.findFirst({
        where: {
          followingId: followingMemberId,
          followerId: followerMemberId,
        },
      });

    // 이미 팔로우하고 있는 경우
    if (oldMemberFollow) {
      throw new ConflictException('이미 follow 중입니다.');
    }

    // member 팔로우
    return this.prismaService.memberFollow.create({
      data: {
        followerId: followerMemberId,
        followingId: followingMemberId,
      },
    });
  }

  /**
   * member unfollow
   */
  async deleteFollowing(
    followingMemberId: number,
    followerMemberId: number,
  ): Promise<MemberFollowEntity> {
    // unfollowing 할 멤버를 가져온다.
    const unfollowerMember: MemberEntity | null =
      await this.prismaService.member.findUnique({
        where: {
          id: followerMemberId,
        },
      });

    // following 할 멤버가 없는 멤버일 경우
    if (!unfollowerMember) {
      throw new NotFoundException('unfollowing 할 멤버가 존재하지 않습니다.');
    }

    // following 할 멤버가 active 상태가 아닌 경우
    if (unfollowerMember.status !== MemberStatus.Active) {
      throw new ForbiddenException(
        'unfollowing 할 멤버가 활성 상태가 아닙니다.',
      );
    }

    // 팔로우 정보를 가져온다.
    const oldMemberFollow: MemberFollowEntity | null =
      await this.prismaService.memberFollow.findFirst({
        where: {
          followingId: followingMemberId,
          followerId: followerMemberId,
        },
      });

    // 팔로우 하고있지 않은 경우
    if (!oldMemberFollow) {
      throw new ConflictException('follow 상태가 아닙니다..');
    }

    // member unfollow
    return this.prismaService.memberFollow.delete({
      where: {
        followerId_followingId: {
          followerId: followerMemberId,
          followingId: followingMemberId,
        },
      },
    });
  }
}
