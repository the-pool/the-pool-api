import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { MockPrismaService } from '@src/modules/test/mock-prisma';
import { string } from 'joi';
import { PrismaService } from '../../database/prisma/prisma.service';
import { OptionalJwtStrategy } from './optional-jwt.strategy';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';

describe('OptionalJwtStrategy', () => {
  let configService: ConfigService;
  let prismaService;
  let jwtService: JwtService;
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
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return 'secret';
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: MockPrismaService,
        },
      ],
    }).compile();
    optionalJwtStrategy = module.get<OptionalJwtStrategy>(OptionalJwtStrategy);
    prismaService = MockPrismaService;
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
      tokenDecodeSpy = jest.spyOn(optionalJwtStrategy, 'tokenDecode');
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
      expect(returnValue).toStrictEqual({ id: 0 });
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

      expect(returnValue).toStrictEqual(
        request.headers.authorization.substr(7),
      );
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
      const returnValue = optionalJwtStrategy.tokenDecode(token);

      expect(returnValue.id).toStrictEqual(memberId);
    });

    it('false - 유효하지 않은 토큰인 경우', async () => {
      token = faker.datatype.uuid();

      expect(async () => {
        await optionalJwtStrategy.tokenDecode(token);
      }).rejects.toThrowError(new UnauthorizedException());
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
      prismaService.member.findFirst.mockReturnValue(null);

      expect(async () => {
        await optionalJwtStrategy.validateMember(memberId);
      }).rejects.toThrowError(new UnauthorizedException());
    });
  });
});
