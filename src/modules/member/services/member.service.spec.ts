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
import { DeleteMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-skills-mapping-request-param.dto';
import { MemberSocialLinkDto } from '@src/modules/member/dtos/member-social-link.dto';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberInterestMappingEntity } from '@src/modules/member/entities/member-interest-mapping.entity';
import { MemberMajorMappingEntity } from '@src/modules/member/entities/member-major-mapping.entity';
import { MemberSkillMappingEntity } from '@src/modules/member/entities/member-skill-mapping.entity';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberService } from '@src/modules/member/services/member.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockAuthService, mockSolutionService } from '@test/mock/mock-services';

describe('MemberService', () => {
  let memberService: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: SolutionService,
          useValue: mockSolutionService,
        },
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

    it('존재 여부 관계없이 return 한다.', async () => {
      mockPrismaService.member.findFirst.mockResolvedValue(member);

      await expect(memberService.findOne(where)).resolves.toStrictEqual(member);
    });
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

  describe('findLessonSolutionStatisticsById', () => {
    let memberId: number;
    let lessonSolutionStatisticsResponseBodyDto: LessonSolutionStatisticsResponseBodyDto;

    beforeEach(() => {
      memberId = faker.datatype.number();
      lessonSolutionStatisticsResponseBodyDto = {
        specific_month_day: BigInt(1),
        total_count: BigInt(1),
        total_day: BigInt(1),
        specific_month_count: BigInt(1),
      } as LessonSolutionStatisticsResponseBodyDto;
    });

    it('조회 성공', async () => {
      mockSolutionService.findStatisticsByMemberId.mockResolvedValue(
        lessonSolutionStatisticsResponseBodyDto,
      );

      await expect(
        memberService.findLessonSolutionStatisticsById(memberId),
      ).resolves.toStrictEqual(lessonSolutionStatisticsResponseBodyDto);
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
      let member: MemberEntity;
      let accessToken: string;

      beforeEach(() => {
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
    let memberSocialLinks: MemberSocialLinkDto[];

    beforeEach(() => {
      id = faker.datatype.number();
      member = new PatchUpdateMemberRequestBodyDto();
    });

    it('memberSocialLinks 가 없는 경우', async () => {
      mockPrismaService.$transaction.mockResolvedValue(member as any);

      await expect(
        memberService.updateFromPatch(id, member),
      ).resolves.toStrictEqual(member);
    });

    it('memberSocialLinks 가 있는 경우', async () => {
      memberSocialLinks = [new MemberSocialLinkDto()];

      mockPrismaService.$transaction.mockResolvedValue(member as any);

      await expect(
        memberService.updateFromPatch(id, member, memberSocialLinks),
      ).resolves.toStrictEqual(member);
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
});
