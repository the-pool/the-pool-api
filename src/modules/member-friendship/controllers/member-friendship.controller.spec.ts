import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFriendshipController } from '@src/modules/member-friendship/controllers/member-friendship.controller';
import { CreateMemberFollowingRequestParamDto } from '@src/modules/member-friendship/dtos/create-member-following-request-param.dto';
import { DeleteMemberFollowingRequestParamDto } from '@src/modules/member-friendship/dtos/delete-member-following-request-param.dto';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
import { MemberFriendshipService } from '@src/modules/member-friendship/services/member-friendship.service';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { mockMemberFriendshipService } from '@test/mock/mock-services';

describe('FriendshipController', () => {
  let controller: MemberFriendshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberFriendshipController],
      providers: [
        {
          provide: MemberFriendshipService,
          useValue: mockMemberFriendshipService,
        },
      ],
    }).compile();

    controller = module.get<MemberFriendshipController>(
      MemberFriendshipController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllFollowers', () => {
    let memberFollowers: {
      followers: MemberEntity[];
      followings: MemberEntity[];
      totalCount: number;
    };
    let query: FindMemberFriendshipListQueryDto;

    beforeEach(() => {
      memberFollowers = {
        followers: [new MemberEntity()],
        followings: [new MemberEntity()],
        totalCount: faker.datatype.number(),
      };
      query = new FindMemberFriendshipListQueryDto();
    });

    it('조회 성공', async () => {
      mockMemberFriendshipService.findAll.mockReturnValue(memberFollowers);

      const result = await controller.findAllFollowers(query);

      expect(mockMemberFriendshipService.findAll).toBeCalledWith(
        query,
        'follower',
      );
      expect(result).toStrictEqual({
        followers: memberFollowers.followers,
        totalCount: memberFollowers.totalCount,
      });
    });
  });

  describe('findAllFollowings', () => {
    let memberFollowings: {
      followers: MemberEntity[];
      followings: MemberEntity[];
      totalCount: number;
    };
    let query: FindMemberFriendshipListQueryDto;

    beforeEach(() => {
      memberFollowings = {
        followers: [new MemberEntity()],
        followings: [new MemberEntity()],
        totalCount: faker.datatype.number(),
      };

      query = new FindMemberFriendshipListQueryDto();
    });

    it('조회 성공', async () => {
      mockMemberFriendshipService.findAll.mockReturnValue(memberFollowings);

      const result = await controller.findAllFollowings(query);

      expect(mockMemberFriendshipService.findAll).toBeCalledWith(
        query,
        'following',
      );
      expect(result).toStrictEqual({
        followings: memberFollowings.followings,
        totalCount: memberFollowings.totalCount,
      });
    });
  });

  describe('createFollowing', () => {
    let member: MemberEntity;
    let param: CreateMemberFollowingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      member = new MemberEntity();
      param = new CreateMemberFollowingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberFriendshipService.createFollowing.mockReturnValue(returnValue);

      const result = controller.createFollowing(member, param);

      expect(mockMemberFriendshipService.createFollowing).toBeCalledTimes(1);
      expect(mockMemberFriendshipService.createFollowing).toBeCalledWith(
        member.id,
        param.memberId,
      );
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('deleteFollowing', () => {
    let member: MemberEntity;
    let param: DeleteMemberFollowingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      member = new MemberEntity();
      param = new DeleteMemberFollowingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberFriendshipService.deleteFollowing.mockReturnValue(returnValue);

      const result = controller.deleteFollowing(member, param);

      expect(mockMemberFriendshipService.deleteFollowing).toBeCalledTimes(1);
      expect(mockMemberFriendshipService.deleteFollowing).toBeCalledWith(
        member.id,
        param.memberId,
      );
      expect(result).toStrictEqual(returnValue);
    });
  });
});
