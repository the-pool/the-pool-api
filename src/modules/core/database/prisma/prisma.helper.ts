import { InternalServerErrorException } from '@nestjs/common';

export class PrismaHelper {
  /**
   *createMany를 편리하게 사용하기 위한 함수
   * ex { userId : [1,2,3], nickname: ['a','b','c']}
   * =>[{userId : 1, nickname : 'a'}, {userId : 2, nickname : 'b'}, {userId : 3, nickname : 'c'}]
   */
  createManyMapper<T>(obj: {
    [key in keyof T]: T[key][];
  }): { [key in keyof T]: T[key] }[] | [] {
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
  }
}
