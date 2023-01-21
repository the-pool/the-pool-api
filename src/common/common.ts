import { BooleanString } from '@src/constants/enum';
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
 * swagger 상에 enum에 들어갈 key,value를 명시하기 위한 함수
 */
export const getEntriesByEnum = <T>(Enum: {
  [key in keyof T]: T[key];
}): T[] => {
  const entries = Object.entries(Enum);
  entries.splice(0, entries.length / 2);

  return [
    entries.reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {}) as T,
  ];
};

/**
 * dtos test 코드를 작성할 때 test하고 싶은 독립된 property를 만들어 낼 때 사용되는 함수
 */
export const customValidate = async <T>(property: {
  [key in keyof T]: any;
}): Promise<ValidationError[]> => {
  return await validate(property, { skipUndefinedProperties: true });
};

export const getNumberEnumValues = (numberEnum: {
  [key: string]: string | number;
}): (number | string)[] => {
  return Object.values(numberEnum).filter((v) => Number.isInteger(v));
};

export const getStrMapByEnum = (Enum) => {
  const map = getEntriesByEnum<typeof Enum>(Enum);
  let mapStr = '{ ';

  for (const key in map) {
    mapStr += key + ': ' + map[key] + ', ';
  }

  return mapStr + ' }';
};
