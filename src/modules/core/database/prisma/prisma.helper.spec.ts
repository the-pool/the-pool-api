import { faker } from '@faker-js/faker';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHelper } from './prisma.helper';

describe('PrismaHelper', () => {
  let prismaHelper: PrismaHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaHelper],
    }).compile();

    prismaHelper = module.get<PrismaHelper>(PrismaHelper);
  });

  it('should be defined', () => {
    expect(prismaHelper).toBeDefined();
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

      const returnValue = prismaHelper.createManyMapper(obj);

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
      let errorWeExceptFor;

      try {
        prismaHelper.createManyMapper(obj);
        errorWeExceptFor = null;
      } catch (error) {
        expect(error).toStrictEqual(
          new InternalServerErrorException(
            '길이가 맞지 않아 createMany를 실행할 수 없습니다.',
          ),
        );
      }
      expect(errorWeExceptFor).not.toBeNull();
    });
  });
});
