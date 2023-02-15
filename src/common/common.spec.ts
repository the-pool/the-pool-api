import { faker } from '@faker-js/faker';
import {
  transformCsvToArray,
  transformEachStrungToNumber,
  transformEachTrim,
} from '@src/common/common';

describe('common', () => {
  describe('transformCsvToArray', () => {
    let value: string;
    let result: string[];

    it(', 가 없는 경우', () => {
      value = faker.datatype.string();

      result = transformCsvToArray({ value });

      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it(', 가 있는 경우', () => {
      value = faker.datatype.string() + ',' + faker.datatype.string();

      result = transformCsvToArray({ value });

      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    afterEach(() => {
      expect(Array.isArray(result)).toBeTruthy();
    });
  });

  describe('transformEachTrim', () => {
    let value: string[];
    let result: string[];

    it('앞에 공백이 있을 때', () => {
      value = [' ' + faker.datatype.string()];

      result = transformEachTrim({ value });
    });

    it('뒤에 공백이 있을 때', () => {
      value = [faker.datatype.string() + ' '];
    });

    it('앞뒤에 공백이 있을 때', () => {
      value = [' ' + faker.datatype.string() + ' '];
    });

    it('공백이 없을 때', () => {
      value = [faker.datatype.string()];
    });

    afterEach(() => {
      result = transformEachTrim({ value });

      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0][0]).not.toBe(' ');
      expect(result[0].at(-1)).not.toBe(' ');
    });
  });

  describe('transformEachNumberToString', () => {
    let value: string[];
    let result: number[];

    it('string 만 있는경우', () => {
      value = [faker.datatype.string()];

      result = transformEachStrungToNumber({ value });

      expect(result[0]).toBeNaN();
    });

    it('number string 만 있는경우', () => {
      value = [String(faker.datatype.number())];

      result = transformEachStrungToNumber({ value });

      expect(typeof result[0]).toBe('number');
    });

    afterEach(() => {
      expect(Array.isArray(result)).toBeTruthy();
    });
  });
});
