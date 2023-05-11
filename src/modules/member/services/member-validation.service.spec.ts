import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  MemberLoginType,
  MemberStatus,
} from '@src/modules/member/constants/member.enum';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';

describe('MemberValidationService', () => {
  let memberValidationService: MemberValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberValidationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    memberValidationService = module.get<MemberValidationService>(
      MemberValidationService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('canLoginOrFail', () => {
    it('request 로 들어온 유저가 없는 경우', () => {
      const account = faker.datatype.string();
      const loginType = MemberLoginType.Apple;
      const memberStatus = MemberStatus.Active;
      const member = new MemberEntity();

      expect(async () => {
        await memberValidationService.canLoginOrFail(
          account,
          loginType,
          memberStatus,
          member,
        );
      }).rejects.toThrowError('존재하지 않는 member 입니다.');
    });

    it('비활성 유저인 경우', () => {
      const account = faker.datatype.string();
      const loginType = MemberLoginType.Apple;
      const memberStatus = MemberStatus.Inactive;
      const member = new MemberEntity();
      member.account = account;
      member.loginType = loginType;
      member.status = memberStatus;

      expect(async () => {
        await memberValidationService.canLoginOrFail(
          account,
          loginType,
          memberStatus,
          member,
        );
      }).rejects.toThrowError('비활성된 유저입니다.');
    });

    it('로그인 가능한 유저인 경우', () => {
      const account = faker.datatype.string();
      const loginType = MemberLoginType.Apple;
      const memberStatus = MemberStatus.Active;
      const member = new MemberEntity();
      member.account = account;
      member.loginType = loginType;
      member.status = memberStatus;

      const result = memberValidationService.canLoginOrFail(
        account,
        loginType,
        memberStatus,
        member,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('canUpdateFromPatchOrFail', () => {
    let updateId: number;
    let updateInfo: PatchUpdateMemberRequestBodyDto;
    let oldMember: MemberEntity;

    beforeEach(() => {
      updateId = faker.datatype.number();
      oldMember = new MemberEntity();
      updateInfo = new PatchUpdateMemberRequestBodyDto();
    });

    it('본인을 업데이트 하려는 경우가 아닌 경우', async () => {
      oldMember.id = updateId + 1;

      await expect(async () => {
        await memberValidationService.canUpdateFromPatchOrFail(
          updateId,
          updateInfo,
          oldMember,
        );
      }).rejects.toThrowError('본인 정보가 아니면 수정이 불가능합니다.');
    });

    it('멤버가 활성중이 아니고 활성 상태로 변경하는 경우가 아닌 경우', async () => {
      oldMember.id = updateId;
      oldMember.status = MemberStatus.Pending;

      await expect(async () => {
        await memberValidationService.canUpdateFromPatchOrFail(
          updateId,
          updateInfo,
          oldMember,
        );
      }).rejects.toThrowError(
        '활성중인 유저거나 활성 상태로 변경하려는 유저만 업데이트 가능합니다.',
      );
    });

    it('nickname 을 변경하지 않는 경우', async () => {
      oldMember.id = updateId;
      oldMember.status = MemberStatus.Active;

      mockPrismaService.member.findUnique.mockResolvedValue(null);

      const result = await memberValidationService.canUpdateFromPatchOrFail(
        updateId,
        updateInfo,
        oldMember,
      );

      await expect(result).toBeUndefined();
    });

    it('변경하려는 nickname 을 다른 멤버가 사용중인 경우', async () => {
      oldMember.id = updateId;
      oldMember.status = MemberStatus.Active;
      updateInfo.nickname = faker.datatype.string();

      mockPrismaService.member.findUnique.mockResolvedValue({} as any);

      await expect(async () => {
        await memberValidationService.canUpdateFromPatchOrFail(
          updateId,
          updateInfo,
          oldMember,
        );
      }).rejects.toThrowError('해당 nickname 은 사용중입니다.');
    });

    it('thumbnail 을 변경하지 않는 경우', async () => {
      oldMember.id = updateId;
      oldMember.status = MemberStatus.Active;

      mockPrismaService.member.findUnique.mockResolvedValue(null);
      mockPrismaService.member.findUnique.mockResolvedValue(null);

      const result = await memberValidationService.canUpdateFromPatchOrFail(
        updateId,
        updateInfo,
        oldMember,
      );

      expect(result).toBeUndefined();
    });

    it('변경하려는 thumbnail 을 다른 멤버가 사용중인 경우', async () => {
      oldMember.id = updateId;
      oldMember.status = MemberStatus.Active;
      updateInfo.thumbnail = faker.datatype.string();

      mockPrismaService.member.findUnique.mockResolvedValue(null);
      mockPrismaService.member.findUnique.mockResolvedValue({} as any);

      await expect(async () => {
        await memberValidationService.canUpdateFromPatchOrFail(
          updateId,
          updateInfo,
          oldMember,
        );
      }).rejects.toThrowError();
    });
  });
});
