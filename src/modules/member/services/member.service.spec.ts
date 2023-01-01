import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  MemberLoginType,
  MemberStatus,
} from '@src/modules/member/constants/member.enum';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockAuthService } from '../../../../test/mock/mock-services';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let memberService: MemberService;
  let authService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    authService = mockAuthService;
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  describe('findOne', () => {
    let randomValue: any;

    beforeEach(() => {
      randomValue = faker.random.words();
      mockPrismaService.member.findUnique.mockReturnValue(randomValue);
    });

    it('가져오기 성공', () => {
      const id = faker.datatype.number();
      const account = faker.datatype.string();
      const status = MemberStatus.Inactive;
      const loginType = MemberLoginType.Apple;

      const result = memberService.findOne({ id, account, status, loginType });

      expect(result).toBe(randomValue);
    });
  });

  describe('create', () => {
    let randomValue: any;

    beforeEach(() => {
      randomValue = faker.random.words();
      mockPrismaService.member.create.mockReturnValue(randomValue);
    });

    it('생성 성공', () => {
      const account = faker.datatype.string();
      const loginType = MemberLoginType.Apple;

      const result = memberService.create(account, loginType);

      expect(result).toBe(randomValue);
    });
  });

  describe('loginByOAuth', () => {
    let loginByOAuthDto: LoginByOAuthDto;

    beforeEach(async () => {
      authService.validateOAuth.mockReturnValue('k1234');
      authService.createAccessToken.mockReturnValue('abcdefg');

      loginByOAuthDto = {
        accessToken: '12345678910',
        oAuthAgency: 0,
      };
    });

    it('이미 등록되어 있는 member이면서 추가 정보를 받은 member인 경우', async () => {
      prismaService.member.findUnique.mockReturnValue({
        status: 1,
      });
      const returnValue = await memberService.loginByOAuth(loginByOAuthDto);

      expect(returnValue).toStrictEqual({
        token: 'abcdefg',
        status: 1,
      });
    });

    it('이미 등록 되어 있는 member이면서 추가정보를 받아야 하는 member인 경우', async () => {
      prismaService.member.findUnique.mockReturnValue({
        status: 0,
      });
      const returnValue = await memberService.loginByOAuth(loginByOAuthDto);

      expect(returnValue).toStrictEqual({
        token: 'abcdefg',
        status: 0,
      });
    });

    it('등록되어 있지 않은 member인 경우', async () => {
      const newMember = {
        id: 3,
        majorId: null,
        account: 'k12345',
        nickname: null,
        status: 0,
        loginType: 1,
        createdAt: '2022-10-23T18:59:25.161Z',
        updatedAt: '2022-10-23T18:59:25.161Z',
        deletedAt: null,
      };

      prismaService.member.findUnique.mockReturnValue(null);
      prismaService.member.create.mockReturnValue(newMember);
      const returnValue = await memberService.loginByOAuth(loginByOAuthDto);

      expect(returnValue).toStrictEqual({
        token: 'abcdefg',
        ...newMember,
      });
    });
  });

  describe('updateMember', () => {
    let member;
    let memberId: number;
    let lastStepLoginDto;
    let memberSkillDeleteManySpy: jest.SpyInstance;
    let memberSkillCreateManySpy: jest.SpyInstance;
    let memberUpdateSpy: jest.SpyInstance;

    beforeEach(async () => {
      member = {
        id: 1,
        majorId: 1,
        account: 'k123456',
        nickname: 'the-pool',
        status: 1,
        loginType: 1,
        createdAt: '2022-10-03T09:54:50.563Z',
        updatedAt: '2022-10-03T09:54:50.563Z',
        deletedAt: null,
      };
      memberId = 1;
      lastStepLoginDto = {
        nickname: 'the-pool',
        majorId: 1,
        memberSkill: [1, 2, 3],
      };

      memberSkillDeleteManySpy = jest.spyOn(
        prismaService.memberSkill,
        'deleteMany',
      );
      memberSkillCreateManySpy = jest.spyOn(
        prismaService.memberSkill,
        'createMany',
      );
      memberUpdateSpy = jest.spyOn(prismaService.member, 'update');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('success - memberSkill이 있을 때', async () => {
      prismaService.memberSkill.deleteMany.mockReturnValue({ count: 0 });
      prismaService.memberSkill.createMany.mockReturnValue({ count: 3 });
      prismaService.member.update.mockReturnValue(member);

      const returnValue = await memberService.updateMember(
        memberId,
        lastStepLoginDto,
      );
      expect(memberSkillDeleteManySpy).toBeCalledTimes(1);
      expect(memberSkillCreateManySpy).toBeCalledTimes(1);
      expect(memberUpdateSpy).toBeCalledTimes(1);
      expect(returnValue).toStrictEqual(member);
    });

    it('success - memberSkill이 없을 때', async () => {
      lastStepLoginDto.memberSkill = [];
      prismaService.member.update.mockReturnValue(member);

      const returnValue = await memberService.updateMember(
        memberId,
        lastStepLoginDto,
      );
      expect(memberSkillDeleteManySpy).toBeCalledTimes(0);
      expect(memberSkillCreateManySpy).toBeCalledTimes(0);
      expect(memberUpdateSpy).toBeCalledTimes(1);
      expect(returnValue).toStrictEqual(member);
    });
  });
});
