import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MemberLoginType,
  MemberStatus,
} from '@src/modules/member/constants/member.enum';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';

describe('MemberValidationService', () => {
  let memberValidationService: MemberValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberValidationService],
    }).compile();

    memberValidationService = module.get<MemberValidationService>(
      MemberValidationService,
    );
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
      }).rejects.toThrowError('존재하지 않는 리소스입니다.');
    });

    it('pending 상태의 유저인 경우', () => {
      const account = faker.datatype.string();
      const loginType = MemberLoginType.Apple;
      const memberStatus = MemberStatus.Pending;
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
      }).rejects.toThrowError('추가정보 입력이 필요한 유저입니다.');
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
});
