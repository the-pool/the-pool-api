import { BooleanString } from '@src/constants/enum';
import { ResponseErrorItem, ResponseJson } from '@src/filters/type';
import { validate, ValidationError } from 'class-validator';

export const pageTransform = ({ value }) => {
  return Number(value) ? Number(value) - 1 : value;
};

export const StringBooleanTransform = ({ value }) => {
  if (value === BooleanString.True) return true;
  if (value === BooleanString.False) return false;
  return value;
};

/**
 * swagger 상에 enum에 들어갈 value를 명시하기 위한 함수
 */
export const getValueByEnum = <T extends string | number>(
  Enum: { [key: string]: string | number },
  type: 'number' | 'string',
): T[] => {
  return Object.values(Enum).filter((el) => {
    return typeof el === type;
  }) as T[];
};

/**
 * dto test 코드를 작성할 때 test하고 싶은 독립된 property를 만들어 낼 때 사용되는 함수
 */
export const customValidate = async <T>(property: {
  [key in keyof T]: any;
}): Promise<ValidationError[]> => {
  return await validate(property, { skipUndefinedProperties: true });
};

/**
 * swagger에 에러에 대한 문서를 만들어주기 위해 사용되는 함수
 */
export const ErrorResponseType = (
  description: string,
  status: number,
  errors: ResponseErrorItem[],
) => {
  const exampleObj: ResponseJson = {
    status,
    timestamp: new Date().toISOString(),
    errors,
  };

  return {
    description,
    schema: {
      example: exampleObj,
    },
  };
};
