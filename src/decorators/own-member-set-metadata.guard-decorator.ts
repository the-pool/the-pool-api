import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnMemberGuard } from '@src/guards/own-member.guard';
import { OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';

/**
 * req.params 의 memberId 필드명 metadata 를 추가한 데코레이터
 *
 * 이 데코레이터를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 */
export const OwnMemberSetMetadataGuard = (fieldName = 'id') => {
  return applyDecorators(
    SetMetadata(OWN_MEMBER_FIELD_NAME, fieldName),
    UseGuards(OwnMemberGuard),
  );
};
