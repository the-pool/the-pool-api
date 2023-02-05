import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { MajorId } from '@src/constants/enum';
import { MemberMajorGuard } from '@src/guards/member-major.guard';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberMajors } from '@src/modules/member/types/member.type';
import {
  mockContext,
  mockReflector,
  mockRequest,
} from '../../test/mock/mock-libs';
import { MockGuardType } from '../../test/mock/mock.type';

describe('MemberMajorGuard', () => {
  let memberMajorGuard: MockGuardType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberMajorGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    memberMajorGuard = module.get(MemberMajorGuard);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(memberMajorGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let allowMemberMajors: MemberMajors;
    let member: MemberEntity;

    beforeEach(() => {
      member = new MemberEntity();
    });

    describe('major 미선택 member 를 허용 ', () => {
      beforeEach(() => {
        allowMemberMajors = [];
        mockReflector.get.mockReturnValue(allowMemberMajors);
      });

      it('성공 케이스', () => {
        member.majorId = null;
        mockRequest.user = member;

        expect(memberMajorGuard.canActivate(mockContext)).toBeTruthy();
      });

      it('실패 케이스', () => {
        member.majorId = MajorId.Design;
        mockRequest.user = member;

        expect(() => {
          memberMajorGuard.canActivate(mockContext);
        }).toThrowError('major 미선택 유저만 접근 가능합니다.');
      });
    });

    describe('major develop member 를 허용 ', () => {
      beforeEach(() => {
        allowMemberMajors = [MajorId.Development];
        mockReflector.get.mockReturnValue(allowMemberMajors);
      });

      it('성공 케이스', () => {
        member.majorId = MajorId.Development;
        mockRequest.user = member;

        expect(memberMajorGuard.canActivate(mockContext)).toBeTruthy();
      });

      it('실패 케이스', () => {
        member.majorId = MajorId.Design;
        mockRequest.user = member;

        expect(() => {
          memberMajorGuard.canActivate(mockContext);
        }).toThrowError('Development major 유저만 접근 가능합니다.');
      });
    });

    describe('major design member 를 허용 ', () => {
      beforeEach(() => {
        allowMemberMajors = [MajorId.Design];
        mockReflector.get.mockReturnValue(allowMemberMajors);
      });

      it('성공 케이스', () => {
        member.majorId = MajorId.Design;
        mockRequest.user = member;

        expect(memberMajorGuard.canActivate(mockContext)).toBeTruthy();
      });

      it('실패 케이스', () => {
        member.majorId = MajorId.Development;
        mockRequest.user = member;

        expect(() => {
          memberMajorGuard.canActivate(mockContext);
        }).toThrowError('Design major 유저만 접근 가능합니다.');
      });
    });

    describe('major design, develop member 를 허용 ', () => {
      beforeEach(() => {
        allowMemberMajors = [MajorId.Development, MajorId.Design];
        mockReflector.get.mockReturnValue(allowMemberMajors);
      });

      it('성공 케이스', () => {
        member.majorId = MajorId.Development;
        mockRequest.user = member;

        expect(memberMajorGuard.canActivate(mockContext)).toBeTruthy();
      });

      it('실패 케이스', () => {
        member.majorId = null;
        mockRequest.user = member;

        expect(() => {
          memberMajorGuard.canActivate(mockContext);
        }).toThrowError('Development, Design major 유저만 접근 가능합니다.');
      });
    });
  });
});
