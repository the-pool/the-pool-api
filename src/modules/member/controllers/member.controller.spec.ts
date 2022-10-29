import { Test, TestingModule } from '@nestjs/testing';
import { MockMemberService } from '@src/modules/test/mock-service';
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
          useValue: MockMemberService,
        },
      ],
    }).compile();

    memberController = module.get<MemberController>(MemberController);
    memberService = MockMemberService;
  });

  it('should be defined', () => {
    expect(memberController).toBeDefined();
    expect(memberService).toBeDefined();
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
      memberService.lastStepLogin.mockReturnValue({});
    });
  });
});
