import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MemberStatusGuard } from '@src/guards/member-status.guard';
import { MEMBER_STATUSES } from '@src/modules/member/constants/member.const';
import { MemberStatuses } from '@src/modules/member/types/member.type';

/**
 * 이 데코레이터를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 */
export const AllowMemberStatusesSetMetadataGuard = (
  memberStatuses: MemberStatuses,
) => {
  return applyDecorators(
    SetMetadata(MEMBER_STATUSES, memberStatuses),
    UseGuards(MemberStatusGuard),
  );
};
