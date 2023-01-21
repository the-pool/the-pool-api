import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
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
});
