import { InternalServerErrorException } from '@nestjs/common';
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
 * dto test 코드를 작성할 때 test하고 싶은 독립된 property를 만들어 낼 때 사용되는 함수
 */
export const customValidate = async <T>(property: {
  [key in keyof T]: any;
}): Promise<ValidationError[]> => {
  return await validate(property, { skipUndefinedProperties: true });
};

/**
 *createMany를 편리하게 사용하기 위한 함수
 * ex { userId : [1,2,3], nickname: ['a','b','c']}
 * =>[{userId : 1, nickname : 'a'}, {userId : 2, nickname : 'b'}, {userId : 3, nickname : 'c'}]
 */
export const createManyMapper = <T>(obj: {
  [key in keyof T]: T[key][];
}): { [key in keyof T]: T[key] }[] | [] => {
  const keys = Object.keys(obj);
  const values: any[][] = Object.values(obj);

  if (keys.length === 0) {
    return [];
  }

  const lengths = [...new Set(values.map((value) => value.length))];

  if (lengths.length > 1) {
    throw new InternalServerErrorException(
      '길이가 맞지 않아 createMany를 실행할 수 없습니다.',
    );
  }

  const result = [];

  for (let i = 0; i < lengths[0]; i += 1) {
    const mapped = {};

    keys.forEach((key, idx) => (mapped[key] = values[idx][i]));
    result.push(mapped);
  }

  return result;
};
