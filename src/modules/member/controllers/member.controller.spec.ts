import { Test, TestingModule } from '@nestjs/testing';
import { MockMemberService } from '@src/modules/test/mock-service';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
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
  });

  describe('loginByOAuth', () => {
    let loginByOAuthDto: LoginByOAuthDto;

    beforeEach(async () => {
      loginByOAuthDto = {
        accessToken: '12345678910',
        oAuthAgency: 0,
      };
    });

    it('로그인 성공', async () => {
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
});
