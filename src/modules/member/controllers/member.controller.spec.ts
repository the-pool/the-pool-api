import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { MemberController } from '@src/modules/member/controllers/member.controller';
import { LoginByOAuthDto } from '@src/modules/member/dtos/create-member-by-oauth.dto';
import { CreateMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/create-member-interest-mapping.request-param.dto';
import { CreateMemberMajorMappingRequestParamDto } from '@src/modules/member/dtos/create-member-major-mapping-request-param.dto';
import { CreateMemberMajorSkillMappingRequestParamDto } from '@src/modules/member/dtos/create-member-major-skill-mapping-request-param.dto';
import { CreateMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/create-member-skills-mapping-request-param.dto';
import { DeleteMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-interest-mapping.request-param.dto';
import { DeleteMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-skills-mapping-request-param.dto';
import { LastStepLoginDto } from '@src/modules/member/dtos/last-step-login.dto';
import { LoginOrSignUpRequestBodyDto } from '@src/modules/member/dtos/login-or-sign-up-request-body.dto';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import {
  mockAuthService,
  mockMemberService,
  mockMemberValidationService,
  mockThePoolConfigService,
} from '@test/mock/mock-services';

describe('MemberController', () => {
  let memberController: MemberController;
  let memberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: ThePoolConfigService,
          useValue: mockThePoolConfigService,
        },
        {
          provide: MemberService,
          useValue: mockMemberService,
        },
        {
          provide: MemberValidationService,
          useValue: mockMemberValidationService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    memberController = module.get<MemberController>(MemberController);
    memberService = mockMemberService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(memberController).toBeDefined();
  });

  describe('findOne', () => {
    let member: MemberEntity;
    let id: number;

    beforeEach(() => {
      member = new MemberEntity();
      id = faker.datatype.number();
    });

    it('조회 성공', async () => {
      mockMemberService.findOneOrFail.mockReturnValue(member);

      const result = memberController.findOne(id);

      expect(mockMemberService.findOneOrFail).toBeCalledWith({
        id,
      });
      expect(result).toStrictEqual(member);
    });
  });

  describe('findLessonSolutionStatistics', () => {
    let lessonSolutionStatisticsResponseBodyDto: LessonSolutionStatisticsResponseBodyDto;
    let param: IdRequestParamDto;

    beforeEach(() => {
      lessonSolutionStatisticsResponseBodyDto = {
        specific_month_day: BigInt(1),
        total_count: BigInt(1),
        total_day: BigInt(1),
        specific_month_count: BigInt(1),
      } as LessonSolutionStatisticsResponseBodyDto;
      param = new IdRequestParamDto();
    });

    it('조회 성공', async () => {
      mockMemberService.findLessonSolutionStatisticsById.mockResolvedValue(
        lessonSolutionStatisticsResponseBodyDto,
      );

      await expect(
        memberController.findLessonSolutionStatistics(param),
      ).resolves.toStrictEqual(
        new LessonSolutionStatisticsResponseBodyDto(
          lessonSolutionStatisticsResponseBodyDto,
        ),
      );
    });
  });

  describe('loginOrSignUp', () => {
    let member: MemberEntity | null;
    let body: LoginOrSignUpRequestBodyDto;
    let oAuthToken: string;

    beforeEach(() => {
      member = new MemberEntity();
      body = new LoginOrSignUpRequestBodyDto();
      oAuthToken = faker.datatype.string();
      mockAuthService.createAccessToken.mockReturnValue(oAuthToken);
    });

    describe('로그인 하는 경우', () => {
      beforeEach(() => {
        mockMemberService.findOne.mockReturnValue(member);
      });

      it('로그인 성공', async () => {
        const result = await memberController.loginOrSignUp(body);

        expect(mockMemberService.login).toBeCalledTimes(1);
      });

      afterEach(() => {
        expect(mockMemberService.findOne).toBeCalledTimes(1);
        expect(mockMemberValidationService.canLoginOrFail).toBeCalledTimes(1);
      });
    });

    describe('회원가입 하는 경우', () => {
      beforeEach(() => {
        member = null;
        mockMemberService.findOne.mockReturnValue(member);
      });

      it('회원가입 성공', async () => {
        const result = await memberController.loginOrSignUp(body);

        expect(mockMemberService.signUp).toBeCalledTimes(1);
      });

      afterEach(() => {
        expect(mockMemberService.findOne).toBeCalledTimes(1);
      });
    });
  });

  describe('updateFromPatch', () => {
    let oldMember: MemberEntity;
    let params: IdRequestParamDto;
    let body: PatchUpdateMemberRequestBodyDto;
    let newMember: MemberEntity;

    beforeEach(() => {
      oldMember = new MemberEntity();
      params = new IdRequestParamDto();
      body = new PatchUpdateMemberRequestBodyDto();
      newMember = new MemberEntity();
    });

    it('업데이트 불가능한 유저', async () => {
      mockMemberValidationService.canUpdateFromPatchOrFail.mockImplementationOnce(
        () => {
          throw new Error();
        },
      );

      await expect(
        memberController.updateFromPatch(oldMember, params, body),
      ).rejects.toThrowError();
      expect(mockMemberService.updateFromPatch).toBeCalledTimes(0);
    });

    it('업데이트 가능한 유저', async () => {
      mockMemberService.updateFromPatch.mockResolvedValue(newMember);

      await expect(
        memberController.updateFromPatch(oldMember, params, body),
      ).resolves.toStrictEqual(newMember);
      expect(mockMemberService.updateFromPatch).toBeCalledTimes(1);
    });
  });

  describe('mappingMajor', () => {
    let params: CreateMemberMajorMappingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      params = new CreateMemberMajorMappingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberService.mappingMajor.mockReturnValue(returnValue);

      const result = memberController.mappingMajor(params);

      expect(mockMemberService.mappingMajor).toBeCalledTimes(1);
      expect(mockMemberService.mappingMajor).toBeCalledWith(
        params.id,
        params.majorId,
      );
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('mappingMajorSkill', () => {
    let member: MemberEntity;
    let params: CreateMemberMajorSkillMappingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      member = new MemberEntity();
      params = new CreateMemberMajorSkillMappingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberService.mappingMajorSkill.mockReturnValue(returnValue);

      const result = memberController.mappingMajorSkill(member, params);

      expect(mockMemberService.mappingMajorSkill).toBeCalledTimes(1);
      expect(mockMemberService.mappingMajorSkill).toBeCalledWith(
        member,
        params,
      );
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('mappingMemberSkills', () => {
    let params: CreateMemberSkillsMappingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      params = new CreateMemberSkillsMappingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberService.mappingMemberSkills.mockReturnValue(returnValue);

      const result = memberController.mappingMemberSkills(params);

      expect(mockMemberService.mappingMemberSkills).toBeCalledTimes(1);
      expect(mockMemberService.mappingMemberSkills).toBeCalledWith(params);
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('unmappingMemberSkills', () => {
    let params: DeleteMemberSkillsMappingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      params = new DeleteMemberSkillsMappingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberService.unmappingMemberSkills.mockReturnValue(returnValue);

      const result = memberController.unmappingMemberSkills(params);

      expect(mockMemberService.unmappingMemberSkills).toBeCalledTimes(1);
      expect(mockMemberService.unmappingMemberSkills).toBeCalledWith(params);
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('mappingMemberInterests', () => {
    let params: CreateMemberInterestMappingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      params = new CreateMemberInterestMappingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 실행', () => {
      mockMemberService.mappingMemberInterests.mockReturnValue(returnValue);

      const result = memberController.mappingMemberInterests(params);

      expect(mockMemberService.mappingMemberInterests).toBeCalledTimes(1);
      expect(mockMemberService.mappingMemberInterests).toBeCalledWith(params);
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('unmappingMemberInterests', () => {
    let params: DeleteMemberInterestMappingRequestParamDto;
    let returnValue: string;

    beforeEach(() => {
      params = new DeleteMemberInterestMappingRequestParamDto();
      returnValue = faker.datatype.string();
    });

    it('정상 싱행', () => {
      mockMemberService.unmappingMemberInterests.mockReturnValue(returnValue);

      const result = memberController.unmappingMemberInterests(params);

      expect(mockMemberService.unmappingMemberInterests).toBeCalledTimes(1);
      expect(mockMemberService.unmappingMemberInterests).toBeCalledWith(params);
      expect(result).toStrictEqual(returnValue);
    });
  });

  describe('loginByOAuth', () => {
    let loginByOAuthDto: LoginByOAuthDto;

    beforeEach(async () => {
      loginByOAuthDto = {
        accessToken: '12345678910',
        oAuthAgency: 0,
      };
    });

    it('success', async () => {
      memberService.loginByOAuth.mockReturnValue({
        accessToken: '1234',
        status: 0,
      });
      const returnValue = await memberController.loginByOAuth(loginByOAuthDto);

      expect(returnValue).toStrictEqual({
        accessToken: '1234',
        status: 0,
      });
    });
  });

  describe('lastStepLogin', () => {
    let lastStepLoginDto: LastStepLoginDto;

    beforeEach(async () => {
      lastStepLoginDto = {
        nickname: 'the-pool',
        majorId: 1,
        memberSkill: [1, 2, 3],
      };
    });

    it('success', async () => {
      const memberId = 1;

      const member = {
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
      memberService.updateMember.mockReturnValue(member);

      const returnValue = await memberController.lastStepLogin(
        memberId,
        lastStepLoginDto,
      );

      expect(returnValue).toStrictEqual(member);
    });
  });
});
