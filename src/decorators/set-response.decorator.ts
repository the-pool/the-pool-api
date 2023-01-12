import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { SetResponseInterceptor } from '@src/interceptors/set-response.interceptor';

/**
 * SetResponseInterceptor 를 사용하기 위해 fieldName 메타데이터를 추가해주는 기능을 추가한 데코레이터
 * @description 이 데코레이터를 사용하려면 provider 로 SetResponseInterceptor 를 등록해주세요
 */
export const setResponse = (responseFieldName: string) =>
  applyDecorators(
    SetMetadata('responseFieldName', responseFieldName),
    UseInterceptors(SetResponseInterceptor),
  );
