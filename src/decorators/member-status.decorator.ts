import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MemberStatusGuard } from '@src/guards/member-status.guard';
import { MEMBER_STATUSES } from '@src/modules/member/constants/member.const';
import { MemberStatuses } from '@src/modules/member/types/member.type';

export const AllowMemberStatuses = (memberStatuses: MemberStatuses) => {
  return applyDecorators(
    SetMetadata(MEMBER_STATUSES, memberStatuses),
    UseGuards(MemberStatusGuard),
  );
};
