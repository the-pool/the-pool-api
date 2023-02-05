import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MemberMajorGuard } from '@src/guards/member-major.guard';
import { MEMBER_JOBS } from '@src/modules/member/constants/member.const';
import { MemberMajors } from '@src/modules/member/types/member.type';

/**
 * MemberMajorGuard 의 허용하는 memberMajors metadata 를 추가한 데코레이터
 *
 * 이 데코레이터를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 */
export const MemberMajorSetMetadataGuard = (...majors: MemberMajors) => {
  return applyDecorators(
    SetMetadata(MEMBER_JOBS, majors),
    UseGuards(MemberMajorGuard),
  );
};
