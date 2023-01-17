import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberStatusGuard } from '@src/guards/member-status.guard';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberStatuses } from '@src/modules/member/types/member.type';
import {
  mockContext,
  mockReflector,
  mockRequest,
} from '../../test/mock/mock-libs';

describe('MemberStatusGuard', () => {
  let memberStatusGuard: {
    canActivate: (context: typeof mockContext) => {};
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberStatusGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    memberStatusGuard = module.get(MemberStatusGuard);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(memberStatusGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let memberStatuses: MemberStatuses;
    let member: MemberEntity;

    beforeEach(() => {
      memberStatuses = [MemberStatus.Active];
      member = new MemberEntity();
    });

    it('성공하는 케이스', () => {
      mockReflector.get.mockReturnValue(memberStatuses);
      member.status = MemberStatus.Active;
      mockRequest.user = member;

      expect(memberStatusGuard.canActivate(mockContext)).toBeTruthy();
    });

    it('실패하는 케이스', () => {
      mockReflector.get.mockReturnValue(memberStatuses);
      member.status = MemberStatus.Inactive;
      mockRequest.user = member;

      expect(() => {
        memberStatusGuard.canActivate(mockContext);
      }).toThrowError('Active 상태의 유저만 접근 가능합니다.');
    });
  });
});
