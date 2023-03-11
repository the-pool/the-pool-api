import { faker } from '@faker-js/faker';
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
 * class transformer CSV 형태를 array 로 변환해준다.
 */
export const transformCsvToArray = ({ value }: { value: string }): string[] => {
  return value.split(',');
};

/**
 * class transformer string[] 를 돌면서 앞뒤 공백을 제거한다.
 */
export const transformEachTrim = ({ value }: { value: string[] }): string[] => {
  return value.map((str) => str.trim());
};

/**
 * class transformer string[] 를 돌면서 number[] 로 변환한다.
 */
export const transformEachStrungToNumber = ({
  value,
}: {
  value: string[];
}): number[] => {
  return value.map((str) => Number(str));
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
 * swagger 상에 enum에 들어갈 key,value를 명시하기 위한 함수 "a" | "b"
 */
export const getEntriesByEnum = <T>(Enum: Record<keyof T, T[keyof T]>) => {
  const entries = Object.entries<T[keyof T]>(Enum);

  entries.splice(0, entries.length / 2);

  return [
    entries.reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {} as Record<keyof T, T[keyof T]>),
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

export const getStrMapByObject = (obj: Record<string, any>) => {
  let mapStr = '{ ';

  for (const key in obj) {
    mapStr += key + ': ' + obj[key] + ', ';
  }

  return mapStr + ' }';
};

/**
 * 객체의 모든 value를 숫자로 변환해 새로운 객체를 return 해주는 함수
 */
export const setObjectValuesToNumber = (
  obj: Record<string, any>,
  min?: number,
  max?: number,
): { [key: string]: number } => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = faker.datatype.number({ min, max });

    return acc;
  }, {});
};
