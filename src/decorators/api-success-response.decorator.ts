import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * 성공에 대한 응답을 swagger상에 보여주고 싶은데 필드명을 커스텀 하고 싶을 때
 * 사용하는 데코레이터이며 원하는데로 필드와 타입을 지정해 줄 수 있다.
 */
export const ApiSuccessResponse = (
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  props: { filed: string; type: Type } | { filed: string; type: Type }[],
) => {
  if (!Array.isArray(props)) {
    props = [props];
  }

  const extraModels: Type[] = [];

  const properties = props.reduce((acc, cur) => {
    const { filed, type } = cur;

    extraModels.push(type);
    acc[filed] = { $ref: getSchemaPath(type) };

    return acc;
  }, {});

  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiResponse({
      status,
      schema: {
        properties: properties,
      },
    }),
  );
};
