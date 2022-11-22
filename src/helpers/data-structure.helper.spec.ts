import { faker } from '@faker-js/faker';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataStructureHelper } from './data-structure.helper';

describe('DataStructureHelper', () => {
  let dataStructureHelper: DataStructureHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataStructureHelper],
    }).compile();

    dataStructureHelper = module.get<DataStructureHelper>(DataStructureHelper);
  });

  it('should be defined', () => {
    expect(dataStructureHelper).toBeDefined();
  });

  describe('createManyMapper', () => {
    let obj;
    //ex { userId : [1,2,3], nickname: ['a','b','c']}
    //=>[{userId : 1, nickname : 'a'}, {userId : 2, nickname : 'b'}, {userId : 3, nickname : 'c'}]
    it('success', () => {
      const values1 = [faker.datatype.number(), faker.datatype.number()];
      const values2 = [faker.datatype.string(), faker.datatype.string()];

      obj = {
        column1: values1,
        column2: values2,
      };

      const returnValue = dataStructureHelper.createManyMapper(obj);

      expect(returnValue[0]['column1']).toStrictEqual(values1[0]);
      expect(returnValue[0]['column2']).toStrictEqual(values2[0]);
    });
    it('false - values들의 길이가 맞지 않을 때', () => {
      const values1 = [faker.datatype.number(), faker.datatype.number()];
      const values2 = [faker.datatype.string()];
      obj = {
        column1: values1,
        column2: values2,
      };
      let errorExceptFor;

      try {
        dataStructureHelper.createManyMapper(obj);
        errorExceptFor = null;
      } catch (error) {
        expect(error).toStrictEqual(
          new InternalServerErrorException(
            '길이가 맞지 않아 createMany를 실행할 수 없습니다.',
          ),
        );
      }
      expect(errorExceptFor).not.toBeNull();
    });
  });
});
