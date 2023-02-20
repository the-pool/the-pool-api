import { faker } from '@faker-js/faker';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UnOwnMemberGuard } from '@src/guards/un-own-member.guard';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import {
  mockContext,
  mockReflector,
  mockRequest,
} from '../../test/mock/mock-libs';
import { MockGuardType } from '../../test/mock/mock.type';

describe('UnOwnMemberGuard', () => {
  let unOwnMemberGuard: MockGuardType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnOwnMemberGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    unOwnMemberGuard = module.get(UnOwnMemberGuard);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(unOwnMemberGuard).toBeDefined();
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
      member.id = Number(memberId) + faker.datatype.number();
      mockRequest.user = member;

      expect(unOwnMemberGuard.canActivate(mockContext)).toBeTruthy();
    });

    it('실패하는 케이스', () => {
      member.id = Number(memberId);
      mockRequest.user = member;

      expect(() => {
        unOwnMemberGuard.canActivate(mockContext);
      }).toThrowError('본인 정보는 접근 불가능합니다.');
    });
  });
});
