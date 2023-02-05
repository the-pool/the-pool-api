import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { MemberStatusGuard } from '@src/guards/member-status.guard';
import { MEMBER_STATUSES } from '@src/modules/member/constants/member.const';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberStatuses } from '@src/modules/member/types/member.type';

jest.mock('@nestjs/common/decorators/core/set-metadata.decorator');
jest.mock('@nestjs/common/decorators/core/use-guards.decorator');

describe('AllowMemberStatusesSetMetadataGuard', () => {
  let memberStatuses: MemberStatuses;

  beforeEach(() => {
    memberStatuses = [MemberStatus.Inactive];
  });

  it('각 데코레이터에 값이 잘 들어가는지 확인', () => {
    AllowMemberStatusesSetMetadataGuard(memberStatuses);

    expect(SetMetadata).toBeCalledWith(MEMBER_STATUSES, memberStatuses);
    expect(UseGuards).toBeCalledWith(MemberStatusGuard);
  });
});
