import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MockPrismaService } from '@src/modules/test/mock-prisma';
import { MockAuthService } from '@src/modules/test/mock-service';
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
          useValue: MockPrismaService,
        },
        {
          provide: AuthService,
          useValue: MockAuthService,
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    authService = MockAuthService;
    prismaService = MockPrismaService;
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
    expect(authService).toBeDefined();
    expect(prismaService).toBeDefined();
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
});
