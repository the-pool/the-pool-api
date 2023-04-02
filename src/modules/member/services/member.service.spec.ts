import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { CreateMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/create-member-interest-mapping.request-param.dto';
import { CreateMemberMajorSkillMappingRequestParamDto } from '@src/modules/member/dtos/create-member-major-skill-mapping-request-param.dto';
import { CreateMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/create-member-skills-mapping-request-param.dto';
import { DeleteMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-interest-mapping.request-param.dto';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberInterestMappingEntity } from '@src/modules/member/entities/member-interest-mapping.entity';
import { MemberMajorMappingEntity } from '@src/modules/member/entities/member-major-mapping.entity';
import { MemberSkillMappingEntity } from '@src/modules/member/entities/member-skill-mapping.entity';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockAuthService } from '../../../../test/mock/mock-services';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { DeleteMemberSkillsMappingRequestParamDto } from '../dtos/delete-member-skills-mapping-request-param.dto';
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

  describe('findOneOrFail', () => {
    let member: MemberEntity;
    let where: Prisma.MemberWhereInput;

    beforeEach(() => {
      member = new MemberEntity();
    });

    it('존재하지 않는 member', async () => {
      mockPrismaService.member.findFirst.mockReturnValue(null as any);

      await expect(memberService.findOneOrFail(where)).rejects.toThrowError();
    });

    it('조회 성공', async () => {
      mockPrismaService.member.findFirst.mockReturnValue(member as any);

      const result = await memberService.findOneOrFail(where);

      expect(mockPrismaService.member.findFirst).toBeCalledWith({
        where,
        include: {
          memberSocialLinkMappings: true,
        },
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

  describe('mappingMajorSkill', () => {
    let member: MemberEntity;
    let params: CreateMemberMajorSkillMappingRequestParamDto;

    beforeEach(() => {
      member = new MemberEntity();
      params = new CreateMemberMajorSkillMappingRequestParamDto();
    });

    it('현재 유저가 가진 major 와 다른 major 에 접근하려는 경우', async () => {
      member.majorId = 1;
      params.majorId = 2;

      await expect(
        memberService.mappingMajorSkill(member, params),
      ).rejects.toThrowError(
        new ForbiddenException(
          '유저의 major 와 다른 major 는 접근이 불가능합니다.',
        ),
      );
    });

    it('존재하지 않는 majorSkill 을 매핑하려는 경우', async () => {
      member.majorId = 1;
      params.majorId = 1;
      params.majorSkillIds = [1, 2];
      mockPrismaService.majorSkill.findMany.mockResolvedValue([
        new MajorSkillEntity(),
      ] as any);

      await expect(
        memberService.mappingMajorSkill(member, params),
      ).rejects.toThrowError(
        new NotFoundException('존재하지 않는 majorSkill 이 존재합니다.'),
      );
    });

    it('매핑하려는 majorSkill 이 현재 유저의 major 의 skill 이 아닌 경우', async () => {
      member.majorId = 1;
      params.majorId = 1;
      params.majorSkillIds = [1];
      const majorSKills: Pick<MajorSkillEntity, 'id' | 'majorId'>[] = [
        { id: 1, majorId: 2 },
      ];
      mockPrismaService.majorSkill.findMany.mockResolvedValue(
        majorSKills as any,
      );

      await expect(
        memberService.mappingMajorSkill(member, params),
      ).rejects.toThrowError(
        new BadRequestException(
          'majorSkill 중 major 에 속하지 않은 skill 이 존재합니다.',
        ),
      );
    });

    it('이미 매핑돼있는 majorSkill 을 매핑하려는 경우', async () => {
      member.majorId = 1;
      params.majorId = 1;
      params.majorSkillIds = [1];
      const majorSKills: Pick<MajorSkillEntity, 'id' | 'majorId'>[] = [
        { id: 1, majorId: 1 },
      ];
      mockPrismaService.majorSkill.findMany.mockResolvedValue(
        majorSKills as any,
      );
      mockPrismaService.memberMajorSkillMapping.findFirst.mockResolvedValue(
        new MemberMajorMappingEntity() as any,
      );

      await expect(
        memberService.mappingMajorSkill(member, params),
      ).rejects.toThrowError(
        new BadRequestException(
          '이미 존재하는 member 의 majorSkill 이 존재합니다.',
        ),
      );
    });

    it('매핑 성공', async () => {
      member.majorId = 1;
      params.majorId = 1;
      params.id = 1;
      params.majorSkillIds = [1];
      const majorSKills: Pick<MajorSkillEntity, 'id' | 'majorId'>[] = [
        { id: 1, majorId: 1 },
      ];
      const result = { count: 1 };
      mockPrismaService.majorSkill.findMany.mockResolvedValue(
        majorSKills as any,
      );
      mockPrismaService.memberMajorSkillMapping.findFirst.mockResolvedValue(
        null as any,
      );
      mockPrismaService.memberMajorSkillMapping.createMany.mockResolvedValue(
        result as any,
      );

      await expect(
        memberService.mappingMajorSkill(member, params),
      ).resolves.toStrictEqual(result);
      expect(
        mockPrismaService.memberMajorSkillMapping.createMany,
      ).toBeCalledWith({
        data: [{ majorSkillId: params.majorSkillIds[0], memberId: params.id }],
      });
    });
  });

  describe('mappingMemberSkills', () => {
    let params: CreateMemberSkillsMappingRequestParamDto;

    beforeEach(() => {
      params = new CreateMemberSkillsMappingRequestParamDto();
    });

    it('이미 mapping 된 memberSkill 을 mapping 하려는 경우', async () => {
      params.memberSkillIds = [1];
      mockPrismaService.memberSkill.findMany.mockResolvedValue([
        1,
      ] as unknown as any);
      mockPrismaService.memberSkillMapping.findFirst.mockResolvedValue(
        new MemberSkillMappingEntity(),
      );

      await expect(
        memberService.mappingMemberSkills(params),
      ).rejects.toThrowError(
        new BadRequestException(
          '이미 존재하는 member 의 majorSkill 이 존재합니다.',
        ),
      );
    });

    it('매핑 성공', async () => {
      params.id = 1;
      params.memberSkillIds = [1, 2];
      const result = { count: 2 };
      const toCreateMemberSkillMappings = [
        { memberSkillId: 1, memberId: 1 },
        { memberSkillId: 2, memberId: 1 },
      ];
      mockPrismaService.memberSkill.findMany.mockResolvedValue([
        1, 2,
      ] as unknown as any);
      mockPrismaService.memberSkillMapping.findFirst.mockResolvedValue(null);
      mockPrismaService.memberSkillMapping.createMany.mockResolvedValue(result);

      await expect(
        memberService.mappingMemberSkills(params),
      ).resolves.toStrictEqual(result);
      expect(mockPrismaService.memberSkillMapping.createMany).toBeCalledWith({
        data: toCreateMemberSkillMappings,
      });
    });

    afterEach(() => {
      mockPrismaService.memberSkill.findMany.mockRestore();
      mockPrismaService.memberSkillMapping.findFirst.mockRestore();
      mockPrismaService.memberSkillMapping.createMany.mockRestore();
    });
  });

  describe('unmappingMemberSkills', () => {
    let params: DeleteMemberSkillsMappingRequestParamDto;

    beforeEach(() => {
      params = new DeleteMemberSkillsMappingRequestParamDto();
    });

    it('mapping 되지 않은 관계를 제거하려는 경우', async () => {
      params.memberSkillIds = [1];
      mockPrismaService.memberSkillMapping.count.mockResolvedValue(0);

      await expect(
        memberService.unmappingMemberSkills(params),
      ).rejects.toThrowError(
        new BadRequestException(
          'mapping 되지 않은 member 의 majorSkill 이 존재합니다.',
        ),
      );
    });

    it('mapping 제거 성공', async () => {
      params.memberSkillIds = [1];
      mockPrismaService.memberSkillMapping.count.mockResolvedValue(
        params.memberSkillIds.length,
      );
      mockPrismaService.memberSkillMapping.deleteMany.mockResolvedValue({
        count: params.memberSkillIds.length,
      });

      await expect(
        memberService.unmappingMemberSkills(params),
      ).resolves.toStrictEqual({
        count: params.memberSkillIds.length,
      });
    });

    afterEach(() => {
      mockPrismaService.memberSkillMapping.count.mockRestore();
      mockPrismaService.memberSkillMapping.deleteMany.mockRestore();
    });
  });

  describe('mappingMemberInterests', () => {
    let params: CreateMemberInterestMappingRequestParamDto;

    beforeEach(() => {
      params = new CreateMemberInterestMappingRequestParamDto();
    });

    it('이미 mapping 된 관계를 만드려는 경우', async () => {
      params.memberInterestIds = [1, 2];
      mockPrismaService.memberInterestMapping.findFirst.mockResolvedValue(
        new MemberInterestMappingEntity(),
      );

      await expect(
        memberService.mappingMemberInterests(params),
      ).rejects.toThrowError(
        new BadRequestException(
          '이미 존재하는 member 의 memberInterest 가 존재합니다.',
        ),
      );
    });

    it('매핑 성공', async () => {
      params.id = 1;
      params.memberInterestIds = [1, 2];
      const result = { count: 2 };
      const toCreateMemberInterestMappings = [
        { memberInterestId: 1, memberId: 1 },
        { memberInterestId: 2, memberId: 1 },
      ];
      mockPrismaService.memberInterestMapping.findFirst.mockResolvedValue(null);
      mockPrismaService.memberInterestMapping.createMany.mockResolvedValue(
        result,
      );

      await expect(
        memberService.mappingMemberInterests(params),
      ).resolves.toStrictEqual(result);
      expect(mockPrismaService.memberInterestMapping.createMany).toBeCalledWith(
        {
          data: toCreateMemberInterestMappings,
        },
      );
    });

    afterEach(() => {
      mockPrismaService.memberInterestMapping.findFirst.mockRestore();
      mockPrismaService.memberInterestMapping.createMany.mockRestore();
    });
  });

  describe('unmappingMemberInterests', () => {
    let params: DeleteMemberInterestMappingRequestParamDto;

    beforeEach(() => {
      params = new DeleteMemberInterestMappingRequestParamDto();
    });

    it('이미 mapping 된 관계를 만드려는 경우', async () => {
      params.memberInterestIds = [1, 2];
      mockPrismaService.memberInterestMapping.count.mockResolvedValue(0);

      await expect(
        memberService.unmappingMemberInterests(params),
      ).rejects.toThrowError(
        new BadRequestException(
          'mapping 되지 않은 member 의 majorInterest 가 존재합니다.',
        ),
      );
    });

    it('매핑 성공', async () => {
      params.memberInterestIds = [1];
      mockPrismaService.memberInterestMapping.count.mockResolvedValue(
        params.memberInterestIds.length,
      );
      mockPrismaService.memberInterestMapping.deleteMany.mockResolvedValue({
        count: params.memberInterestIds.length,
      });

      await expect(
        memberService.unmappingMemberInterests(params),
      ).resolves.toStrictEqual({
        count: params.memberInterestIds.length,
      });
    });

    afterEach(() => {
      mockPrismaService.memberInterestMapping.count.mockRestore();
      mockPrismaService.memberInterestMapping.deleteMany.mockRestore();
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
