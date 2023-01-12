import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { RESPONSE_FIELD_NAME } from '@src/constants/constant';
import { SetResponseInterceptor } from '@src/interceptors/set-response.interceptor';

/**
 * SetResponseInterceptor 를 사용하기 위해 fieldName 메타데이터를 추가해주는 기능을 추가한 데코레이터
 */
export const setResponse = (responseFieldName: string) => {
  return applyDecorators(
    SetMetadata(RESPONSE_FIELD_NAME, responseFieldName),
    UseInterceptors(SetResponseInterceptor),
  );
};
