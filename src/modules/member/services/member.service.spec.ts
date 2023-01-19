import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  describe('findOne', () => {
    let member: MemberEntity;
    let where: Prisma.MemberWhereInput;

    beforeEach(() => {
      member = new MemberEntity();
    });

    it('조회 성공', async () => {
      mockPrismaService.member.findFirst.mockReturnValue(member as any);

      const result = await memberService.findOne(where);

      expect(mockPrismaService.member.findFirst).toBeCalledWith({
        where,
      });
      expect(result).toStrictEqual(member);
    });
  });

  describe('loginOrSignUp', () => {
    describe('signUp', () => {
      let account: string;
      let newMember: MemberEntity;
      let accessToken: string;
      const loginType = MemberLoginType.Apple;

      beforeEach(() => {
        account = faker.datatype.string();
        newMember = new MemberEntity();
      });

      it('회원가입 성공', async () => {
        accessToken = faker.datatype.string();
        mockPrismaService.member.create.mockResolvedValue(newMember as any);
        mockAuthService.createAccessToken.mockReturnValue(accessToken);

        const result = await memberService.signUp(account, loginType);

        expect(result).toStrictEqual({
          accessToken,
          member: newMember,
        });
      });
    });

    describe('login', () => {
      let account: string;
      let member: MemberEntity;
      let accessToken: string;

      beforeEach(() => {
        account = faker.datatype.string();
        member = new MemberEntity();
      });

      it('로그인 성공', async () => {
        accessToken = faker.datatype.string();
        mockAuthService.createAccessToken.mockReturnValue(accessToken);

        const result = await memberService.login(member);

        expect(result).toStrictEqual({
          accessToken,
          member,
        });
      });
    });
  });

  describe('updateFromPatch', () => {
    let id: number;
    let member: PatchUpdateMemberRequestBodyDto;

    beforeEach(() => {
      id = faker.datatype.number();
      member = new PatchUpdateMemberRequestBodyDto();
    });

    it('업데이트 성공', async () => {
      mockPrismaService.member.update.mockResolvedValue(member as any);

      const result = await memberService.updateFromPatch(id, member);

      expect(result).toStrictEqual(member);
    });
  });

  describe('findOne', () => {
    let member: MemberEntity;
    let where: Prisma.MemberWhereInput;

    beforeEach(() => {
      member = new MemberEntity();
    });

    it('조회 성공', async () => {
      mockPrismaService.member.findFirst.mockReturnValue(member as any);

      const result = await memberService.findOne(where);

      expect(mockPrismaService.member.findFirst).toBeCalledWith({
        where,
      });
      expect(result).toStrictEqual(member);
    });
  });

  describe('loginOrSignUp', () => {
    describe('signUp', () => {
      let account: string;
      let newMember: MemberEntity;
      let accessToken: string;
      const loginType = MemberLoginType.Apple;

      beforeEach(() => {
        account = faker.datatype.string();
        newMember = new MemberEntity();
      });

      it('회원가입 성공', async () => {
        accessToken = faker.datatype.string();
        mockPrismaService.member.create.mockResolvedValue(newMember as any);
        mockAuthService.createAccessToken.mockReturnValue(accessToken);

        const result = await memberService.signUp(account, loginType);

        expect(result).toStrictEqual({
          accessToken,
          member: newMember,
        });
      });
    });

    describe('login', () => {
      let account: string;
      let member: MemberEntity;
      let accessToken: string;

      beforeEach(() => {
        account = faker.datatype.string();
        member = new MemberEntity();
      });

      it('로그인 성공', async () => {
        accessToken = faker.datatype.string();
        mockAuthService.createAccessToken.mockReturnValue(accessToken);

        const result = await memberService.login(member);

        expect(result).toStrictEqual({
          accessToken,
          member,
        });
      });
    });
  });

  describe('updateFromPatch', () => {
    let id: number;
    let member: PatchUpdateMemberRequestBodyDto;

    beforeEach(() => {
      id = faker.datatype.number();
      member = new PatchUpdateMemberRequestBodyDto();
    });

    it('업데이트 성공', async () => {
      mockPrismaService.member.update.mockResolvedValue(member as any);

      const result = await memberService.updateFromPatch(id, member);

      expect(result).toStrictEqual(member);
    });
  });

  describe('mappingMajor', () => {
    let id: number;
    let majorId: number;
    let returnValue;

    beforeEach(() => {
      id = faker.datatype.number();
      majorId = faker.datatype.number();
      returnValue = faker.datatype.string();
    });

    it('매핑 성공', () => {
      mockPrismaService.member.update.mockReturnValue(returnValue);

      const result = memberService.mappingMajor(id, majorId);

      expect(mockPrismaService.member.update).toBeCalledTimes(1);
      expect(mockPrismaService.member.update).toBeCalledWith({
        data: {
          majorId,
        },
        where: {
          id,
        },
        include: {
          major: true,
        },
      });
      expect(result).toStrictEqual(returnValue);
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
    let memberMajorSkillMappingDeleteManySpy: jest.SpyInstance;
    let memberMajorSkillMappingCreateManySpy: jest.SpyInstance;
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

      memberMajorSkillMappingDeleteManySpy = jest.spyOn(
        prismaService.memberMajorSkillMapping,
        'deleteMany',
      );
      memberMajorSkillMappingCreateManySpy = jest.spyOn(
        prismaService.memberMajorSkillMapping,
        'createMany',
      );
      memberUpdateSpy = jest.spyOn(prismaService.member, 'update');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('success - memberMajorSkillMapping이 있을 때', async () => {
      prismaService.memberMajorSkillMapping.deleteMany.mockReturnValue({
        count: 0,
      });
      prismaService.memberMajorSkillMapping.createMany.mockReturnValue({
        count: 3,
      });
      prismaService.member.update.mockReturnValue(member);

      const returnValue = await memberService.updateMember(
        memberId,
        lastStepLoginDto,
      );
      expect(memberMajorSkillMappingDeleteManySpy).toBeCalledTimes(1);
      expect(memberMajorSkillMappingCreateManySpy).toBeCalledTimes(1);
      expect(memberUpdateSpy).toBeCalledTimes(1);
      expect(returnValue).toStrictEqual(member);
    });

    it('success - memberMajorSkillMapping이 없을 때', async () => {
      lastStepLoginDto.memberSkill = [];
      prismaService.member.update.mockReturnValue(member);

      const returnValue = await memberService.updateMember(
        memberId,
        lastStepLoginDto,
      );
      expect(memberMajorSkillMappingDeleteManySpy).toBeCalledTimes(0);
      expect(memberMajorSkillMappingCreateManySpy).toBeCalledTimes(0);
      expect(memberUpdateSpy).toBeCalledTimes(1);
      expect(returnValue).toStrictEqual(member);
    });
  });
});
