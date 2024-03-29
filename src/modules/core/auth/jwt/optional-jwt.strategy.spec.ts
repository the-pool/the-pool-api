import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { OptionalJwtStrategy } from '@src/modules/core/auth/jwt/optional-jwt.strategy';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import jwt from 'jsonwebtoken';

describe('OptionalJwtStrategy', () => {
  let prismaService;
  let optionalJwtStrategy: OptionalJwtStrategy;

  beforeEach(async () => {
    const config = {
      secretOrKeyProvider: (requestType: JwtSecretRequestType) => 'secret',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, JwtModule.register(config)],
      providers: [
        OptionalJwtStrategy,
        {
          provide: ThePoolConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return 'secret';
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();
    optionalJwtStrategy = module.get<OptionalJwtStrategy>(OptionalJwtStrategy);
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(optionalJwtStrategy);
  });

  describe('validate', () => {
    let request;
    let getTokenSpy: jest.SpyInstance;
    let tokenDecodeSpy: jest.SpyInstance;
    let validateMemberSpy: jest.SpyInstance;
    let memberId: number;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      request = {
        headers: {
          authorization: 'Bearer' + ' ' + jwt.sign({ id: memberId }, 'secret'),
        },
      };
      getTokenSpy = jest.spyOn(optionalJwtStrategy, 'getToken');
      tokenDecodeSpy = jest.spyOn(optionalJwtStrategy, 'validateToken');
      validateMemberSpy = jest.spyOn(optionalJwtStrategy, 'validateMember');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('success - token이 존재하는 경우 (회원)', async () => {
      prismaService.member.findFirst.mockReturnValue({ id: memberId });
      const returnValue = await optionalJwtStrategy.validate(request);

      expect(getTokenSpy).toBeCalledTimes(1);
      expect(tokenDecodeSpy).toBeCalledTimes(1);
      expect(validateMemberSpy).toBeCalledTimes(1);
      expect(returnValue).toStrictEqual({ id: memberId });
    });

    it('success - token이 존재하지 않는 경우 (비회원)', async () => {
      request.headers.authorization = null;
      const returnValue = await optionalJwtStrategy.validate(request);

      expect(getTokenSpy).toBeCalledTimes(1);
      expect(tokenDecodeSpy).toBeCalledTimes(0);
      expect(validateMemberSpy).toBeCalledTimes(0);
      expect(returnValue).toStrictEqual({ id: null });
    });
  });

  describe('getToken', () => {
    let request;
    let memberId: number;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      request = {
        headers: {
          authorization: 'Bearer' + ' ' + jwt.sign({ id: memberId }, 'secret'),
        },
      };
    });

    it('success - token이 존재하는 경우 (회원)', async () => {
      const returnValue = optionalJwtStrategy.getToken(request);

      expect(returnValue).toStrictEqual(request.headers.authorization.slice(7));
    });

    it('success - token이 존재하지 않는 경우 (비회원)', async () => {
      request.headers.authorization = null;
      const returnValue = optionalJwtStrategy.getToken(request);

      expect(returnValue).toStrictEqual(null);
    });
  });

  describe('tokenDecode', () => {
    let memberId: number;
    let token: string;
    beforeEach(async () => {
      memberId = faker.datatype.number();
      token = jwt.sign({ id: memberId }, 'secret');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      const returnValue = optionalJwtStrategy.validateToken(token);

      expect(returnValue.id).toStrictEqual(memberId);
    });

    it('false - 유효하지 않은 토큰인 경우', async () => {
      token = faker.datatype.uuid();

      expect(() => {
        optionalJwtStrategy.validateToken(token);
      }).toThrowError('jwt malformed');
    });
  });

  describe('validateMember', () => {
    let memberId: number;

    beforeEach(async () => {
      memberId = faker.datatype.number();
    });

    it('success', async () => {
      prismaService.member.findFirst.mockReturnValue({ id: memberId });

      const returnValue = await optionalJwtStrategy.validateMember(memberId);

      expect(returnValue).toStrictEqual({ id: memberId });
    });

    it('false - 토큰에서 얻어낸 memberId가 존재하지 않는 멤버일 때', async () => {
      prismaService.member.findFirst.mockResolvedValue(null);

      await expect(
        optionalJwtStrategy.validateMember(memberId),
      ).rejects.toThrowError(new UnauthorizedException());
    });
  });
});
