import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  FROM_MEMBER_REQUEST_PARAM_FIELD_NAME,
  INCREASE_ACTION,
} from '@src/constants/constant';
import { IncreaseMemberFollowInterceptor } from '@src/interceptors/increase-member-follow.interceptor';
import { IncreaseAction } from '@src/types/type';

/**
 * IncreaseMemberFollowInterceptor 를 사용하기 위해 fieldName 메타데이터를 추가해주는 기능을 추가한 데코레이터
 *
 * member follow 에 대한 변경사항이 있을 때 사용
 */
export const IncreaseMemberFollowSetMetadataInterceptor = (
  fromMemberRequestParamFieldName: string,
  action: IncreaseAction,
) => {
  return applyDecorators(
    SetMetadata(
      FROM_MEMBER_REQUEST_PARAM_FIELD_NAME,
      fromMemberRequestParamFieldName,
    ),
    SetMetadata(INCREASE_ACTION, action),
    UseInterceptors(IncreaseMemberFollowInterceptor),
  );
};
