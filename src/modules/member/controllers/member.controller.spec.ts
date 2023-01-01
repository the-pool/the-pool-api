import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { LoginOrSignUpDto } from '@src/modules/member/dtos/login-or-sign-up.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import {
  mockAuthService,
  mockMemberService,
  mockMemberValidationService,
} from '../../../../test/mock/mock-services';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { MemberService } from '../services/member.service';
import { MemberController } from './member.controller';

describe('MemberController', () => {
  let memberController: MemberController;
  let memberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
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

  it('should be defined', () => {
    expect(memberController).toBeDefined();
  });

  describe('loginOrSignUp', () => {
    let member: MemberEntity;
    let body: LoginOrSignUpDto;
    let accessToken: string;

    beforeEach(() => {
      member = new MemberEntity();
      body = new LoginOrSignUpDto();
      accessToken = faker.datatype.string();
      mockAuthService.createAccessToken.mockReturnValue(accessToken);
    });

    describe('로그인 하는 경우', () => {
      beforeEach(() => {
        member.id = faker.datatype.number();
      });

      it('로그인 성공', async () => {
        const result = await memberController.loginOrSignUp(member, body);

        expect(result).toStrictEqual({
          accessToken,
          member,
        });
      });

      afterEach(() => {
        expect(mockMemberValidationService.canLoginOrFail).toBeCalledTimes(1);
        expect(mockAuthService.createAccessToken).toBeCalledTimes(1);
      });
    });

    describe('회원가입 하는 경우', () => {
      it('이미 존재하는 유저인 경우', async () => {
        mockMemberService.findOne.mockReturnValue(new MemberEntity());

        await expect(async () => {
          await memberController.loginOrSignUp(member, body);
        }).rejects.toThrowError('이미 존재하는 유저입니다.');
        expect(mockMemberService.create).toBeCalledTimes(0);
        expect(mockAuthService.createAccessToken).toBeCalledTimes(0);
      });

      it('회원가입 성공', async () => {
        mockMemberService.findOne.mockReturnValue(null);
        mockMemberService.create.mockReturnValue(member);

        const result = await memberController.loginOrSignUp(member, body);

        expect(result).toStrictEqual({
          accessToken,
          member,
        });
        expect(mockMemberService.create).toBeCalledTimes(1);
        expect(mockAuthService.createAccessToken).toBeCalledTimes(1);
      });

      afterEach(() => {
        expect(mockMemberService.findOne).toBeCalledTimes(1);
      });
    });

    afterEach(() => {
      expect(mockAuthService.validateExternalAccessTokenOrFail).toBeCalledTimes(
        1,
      );
      jest.clearAllMocks();
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
