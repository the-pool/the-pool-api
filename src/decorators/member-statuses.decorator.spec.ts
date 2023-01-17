import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { AllowMemberStatuses } from '@src/decorators/member-statuses.decorator';
import { OwnMember } from '@src/decorators/own-member.decorator';
import { MemberStatusGuard } from '@src/guards/member-status.guard';
import { MEMBER_STATUSES } from '@src/modules/member/constants/member.const';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberStatuses } from '@src/modules/member/types/member.type';

jest.mock('@nestjs/common/decorators/core/set-metadata.decorator');
jest.mock('@nestjs/common/decorators/core/use-guards.decorator');

describe('OwnMember', () => {
  let memberStatuses: MemberStatuses;

  beforeEach(() => {
    memberStatuses = [MemberStatus.Inactive];
  });

  it('각 데코레이터에 값이 잘 들어가는지 확인', () => {
    AllowMemberStatuses(memberStatuses);

    expect(SetMetadata).toBeCalledWith(MEMBER_STATUSES, memberStatuses);
    expect(UseGuards).toBeCalledWith(MemberStatusGuard);
  });
});
