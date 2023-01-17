import { faker } from '@faker-js/faker';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { OwnMemberGuard } from '@src/guards/own-member.guard';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import {
  mockContext,
  mockReflector,
  mockRequest,
} from '../../test/mock/mock-libs';
import { MockGuardType } from '../../test/mock/mock.type';

describe('OwnMemberGuard', () => {
  let ownMemberGuard: MockGuardType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnMemberGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    ownMemberGuard = module.get(OwnMemberGuard);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(ownMemberGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let memberIdFieldName: string;
    let member: MemberEntity;
    let memberId: string;
    let params: object;

    beforeEach(() => {
      memberIdFieldName = faker.datatype.string();
      member = new MemberEntity();
      memberId = String(faker.datatype.number());
      params = {
        [memberIdFieldName]: memberId,
      };
      mockReflector.get.mockReturnValue(memberIdFieldName);
      mockRequest.params = params;
    });

    it('성공하는 케이스', () => {
      member.id = Number(memberId);
      mockRequest.user = member;

      expect(ownMemberGuard.canActivate(mockContext)).toBeTruthy();
    });

    it('실패하는 케이스', () => {
      member.id = Number(memberId) + faker.datatype.number();
      mockRequest.user = member;

      expect(() => {
        ownMemberGuard.canActivate(mockContext);
      }).toThrowError('본인 정보만 접근 가능합니다.');
    });
  });
});
