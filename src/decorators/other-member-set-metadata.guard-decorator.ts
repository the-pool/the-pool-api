import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OtherMemberGuard } from '@src/guards/other-member.guard';
import { UN_OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';

/**
 * req.params 의 memberId 필드명 metadata 를 추가한 데코레이터
 *
 * 이 데코레이터를 사용하려면 JwtAuthGuard 가 붙어있어야합니다.
 */
export const OtherMemberSetMetadataGuard = (fieldName = 'id') => {
  return applyDecorators(
    SetMetadata(UN_OWN_MEMBER_FIELD_NAME, fieldName),
    UseGuards(OtherMemberGuard),
  );
};
