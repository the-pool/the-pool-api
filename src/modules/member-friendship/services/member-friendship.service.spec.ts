import { faker } from '@faker-js/faker';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
import { MemberFollowEntity } from '@src/modules/member-friendship/entities/member-follow.entity';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { mockQueryHelper } from '../../../../test/mock/mock-helpers';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { MemberFriendshipService } from './member-friendship.service';

describe('FriendshipService', () => {
  let service: MemberFriendshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberFriendshipService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: QueryHelper,
          useValue: mockQueryHelper,
        },
      ],
    }).compile();

    service = module.get<MemberFriendshipService>(MemberFriendshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let follower: MemberEntity;
    let following: MemberEntity;
    let totalCount: number;
    let findManyResult;
    let query: FindMemberFriendshipListQueryDto;
    let order: string;
    let result;

    beforeEach(() => {
      follower = new MemberEntity();
      following = new MemberEntity();
      findManyResult = [{ follower, following }];
      query = new FindMemberFriendshipListQueryDto();
      totalCount = faker.datatype.number();
      order = faker.datatype.string();
    });

    beforeEach(() => {
      query.memberId = faker.datatype.number({ min: 1 });
      mockPrismaService.memberFollow.findMany.mockResolvedValue(
        findManyResult as any,
      );
      mockPrismaService.memberFollow.count.mockResolvedValue(totalCount as any);
      mockPrismaService.$transaction.mockResolvedValue([
        findManyResult,
        totalCount,
      ] as any);
      mockQueryHelper.buildOrderByPropForFind.mockReturnValue(order);
    });

    it('member followers 조회 성공', async () => {
      result = await service.findAll(query, 'follower');

      expect(mockPrismaService.memberFollow.findMany).toBeCalledWith({
        select: {
          follower: true,
        },
        where: {
          followerId: undefined,
          followingId: query.memberId,
        },
        orderBy: expect.anything(),
        skip: expect.anything(),
        take: expect.anything(),
      });
      expect(mockPrismaService.memberFollow.count).toBeCalledWith({
        where: {
          followerId: undefined,
          followingId: query.memberId,
        },
        orderBy: expect.anything(),
      });
    });

    it('member followings 조회 성공', async () => {
      result = await service.findAll(query, 'following');

      expect(mockPrismaService.memberFollow.findMany).toBeCalledWith({
        select: {
          following: true,
        },
        where: {
          followerId: query.memberId,
          followingId: undefined,
        },
        orderBy: expect.anything(),
        skip: expect.anything(),
        take: expect.anything(),
      });
      expect(mockPrismaService.memberFollow.count).toBeCalledWith({
        where: {
          followerId: query.memberId,
          followingId: undefined,
        },
        orderBy: expect.anything(),
      });
    });

    afterEach(() => {
      expect(mockPrismaService.$transaction).toBeCalledWith([
        Promise.resolve(findManyResult),
        Promise.resolve(totalCount),
      ]);
      expect(mockPrismaService.memberFollow.findMany).toBeCalledTimes(1);
      expect(mockPrismaService.memberFollow.count).toBeCalledTimes(1);
      expect(mockPrismaService.$transaction).toBeCalledTimes(1);
      expect(result).toStrictEqual({
        followers: [follower],
        followings: [following],
        totalCount,
      });
    });
  });

  describe('createFollowing', () => {
    let followingMemberId: number;
    let followerMemberId: number;

    beforeEach(() => {
      followingMemberId = faker.datatype.number();
      followerMemberId = faker.datatype.number();
    });

    it('following 할 멤버가 없는 멤버일 경우', async () => {
      mockPrismaService.member.findUnique.mockResolvedValue(null);

      await expect(
        service.createFollowing(followingMemberId, followerMemberId),
      ).rejects.toThrowError(
        new NotFoundException('following 할 멤버가 존재하지 않습니다.'),
      );
    });

    it('following 할 멤버가 active 상태가 아닌 경우', async () => {
      const followerMember = new MemberEntity();

      followerMember.status = MemberStatus.Inactive;
      mockPrismaService.member.findUnique.mockResolvedValue(followerMember);

      await expect(
        service.createFollowing(followingMemberId, followerMemberId),
      ).rejects.toThrowError(
        new ForbiddenException('following 할 멤버가 활성 상태가 아닙니다.'),
      );
    });

    it('이미 팔로우하고 있는 경우', async () => {
      const followerMember = new MemberEntity();
      const memberFollow = new MemberFollowEntity();

      followerMember.status = MemberStatus.Active;
      mockPrismaService.member.findUnique.mockResolvedValue(followerMember);
      mockPrismaService.memberFollow.findFirst.mockResolvedValue(memberFollow);

      await expect(
        service.createFollowing(followingMemberId, followerMemberId),
      ).rejects.toThrowError(new ConflictException('이미 follow 중입니다.'));
    });

    it('팔로우 성공', async () => {
      const followerMember = new MemberEntity();
      const memberFollow = new MemberFollowEntity();

      followerMember.status = MemberStatus.Active;
      mockPrismaService.member.findUnique.mockResolvedValue(followerMember);
      mockPrismaService.memberFollow.findFirst.mockResolvedValue(null);
      mockPrismaService.memberFollow.create.mockResolvedValue(memberFollow);

      await expect(
        service.createFollowing(followingMemberId, followerMemberId),
      ).resolves.toStrictEqual(memberFollow);
    });

    afterEach(() => {
      mockPrismaService.member.findUnique.mockRestore();
      mockPrismaService.member.findFirst.mockRestore();
      mockPrismaService.memberFollow.create.mockRestore();
    });
  });

  describe('deleteFollowing', () => {
    let unfollowingMemberId: number;
    let unfollowerMemberId: number;

    beforeEach(() => {
      unfollowingMemberId = faker.datatype.number();
      unfollowerMemberId = faker.datatype.number();
    });

    it('unfollowing 할 멤버가 없는 멤버일 경우', async () => {
      mockPrismaService.member.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteFollowing(unfollowingMemberId, unfollowerMemberId),
      ).rejects.toThrowError(
        new NotFoundException('unfollowing 할 멤버가 존재하지 않습니다.'),
      );
    });

    it('unfollowing 할 멤버가 active 상태가 아닌 경우', async () => {
      const unfollowerMember = new MemberEntity();

      unfollowerMember.status = MemberStatus.Inactive;
      mockPrismaService.member.findUnique.mockResolvedValue(unfollowerMember);

      await expect(
        service.deleteFollowing(unfollowingMemberId, unfollowerMemberId),
      ).rejects.toThrowError(
        new ForbiddenException('unfollowing 할 멤버가 활성 상태가 아닙니다.'),
      );
    });

    it('팔로우 하고있지 않은 경우', async () => {
      const unfollowerMember = new MemberEntity();

      unfollowerMember.status = MemberStatus.Active;
      mockPrismaService.member.findUnique.mockResolvedValue(unfollowerMember);
      mockPrismaService.memberFollow.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteFollowing(unfollowingMemberId, unfollowerMemberId),
      ).rejects.toThrowError(new ConflictException('follow 상태가 아닙니다.'));
    });

    it('unfollow 성공', async () => {
      const unfollowerMember = new MemberEntity();
      const memberFollow = new MemberFollowEntity();

      unfollowerMember.status = MemberStatus.Active;
      mockPrismaService.member.findUnique.mockResolvedValue(unfollowerMember);
      mockPrismaService.memberFollow.findFirst.mockResolvedValue(memberFollow);
      mockPrismaService.memberFollow.delete.mockResolvedValue(memberFollow);

      await expect(
        service.deleteFollowing(unfollowingMemberId, unfollowerMemberId),
      ).resolves.toStrictEqual(memberFollow);
    });

    afterEach(() => {
      mockPrismaService.member.findUnique.mockRestore();
      mockPrismaService.member.findFirst.mockRestore();
      mockPrismaService.memberFollow.delete.mockRestore();
    });
  });
});
