import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnMemberGuard } from '@src/guards/own-member.guard';
import { OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';

export const OwnMember = (fieldName = 'id') => {
  return applyDecorators(
    SetMetadata(OWN_MEMBER_FIELD_NAME, fieldName),
    UseGuards(OwnMemberGuard),
  );
};
