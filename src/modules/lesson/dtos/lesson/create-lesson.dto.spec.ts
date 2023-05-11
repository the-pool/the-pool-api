import { faker } from '@faker-js/faker';
import { customValidate, getValueByEnum } from '@src/common/common';
import { LessonCategoryId, LessonLevelId } from '@src/constants/enum';
import { CreateLessonDto } from '@src/modules/lesson/dtos/lesson/create-lesson.dto';

describe('CreateLessonDto', () => {
  let createLessonDto: { [key in keyof CreateLessonDto]: any };

  beforeEach(async () => {
    createLessonDto = new CreateLessonDto();
  });

  it('should be defined', () => {
    expect(createLessonDto).toBeDefined();
  });

  describe('levelId test', () => {
    it.each(getValueByEnum(LessonLevelId, 'number'))(
      'success - levelId: %s',
      async (levelId) => {
        createLessonDto.levelId = levelId;
        const errors = await customValidate(createLessonDto);

        expect(errors).toHaveLength(0);
      },
    );

    it('false - levelId에 아무런 값도 들어오지 않았을 때', async () => {
      createLessonDto.levelId = null;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('false - levelId에 ENUM이 아닌 값이 들어왔을 때', async () => {
      createLessonDto.levelId = 4;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('categoryId test', () => {
    it.each(getValueByEnum(LessonCategoryId, 'number'))(
      'success - categoryId: %s',
      async (categoryId) => {
        createLessonDto.categoryId = categoryId;
        const errors = await customValidate(createLessonDto);

        expect(errors).toHaveLength(0);
      },
    );

    it('false - categoryId에 아무런 값도 들어오지 않았을 때', async () => {
      createLessonDto.categoryId = null;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('false - categoryId에 ENUM이 아닌 값이 들어왔을 때', async () => {
      createLessonDto.categoryId = 0;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('description test', () => {
    it('success - description', async () => {
      createLessonDto.description = 'description';

      expect(typeof createLessonDto.description === 'string').toBeTruthy();
    });

    it('false - description이 string이 아닐 때', async () => {
      createLessonDto.description = 1;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('false - description에 아무런 값도 들어오지 않았을 때', async () => {
      createLessonDto.description = null;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('title test', () => {
    it('success - title', async () => {
      createLessonDto.title = 'title';

      expect(typeof createLessonDto.title === 'string').toBeTruthy();
      expect(createLessonDto.title.length).toBeGreaterThanOrEqual(1);
      expect(createLessonDto.title.length).toBeLessThanOrEqual(50);
    });

    it('false - title이 string이 아닐 때', async () => {
      createLessonDto.title = 1;
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });
    it('false - title의 length가 범위를 벗어났을 때', async () => {
      createLessonDto.title =
        '123456789012345678901234567890123456789012345678901';
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isLength');
    });
  });

  describe('thumbnail test', () => {
    it('success - thumbnail', async () => {
      createLessonDto.thumbnail = faker.image.imageUrl();

      expect(typeof createLessonDto.thumbnail === 'string').toBeTruthy();
    });

    it('false - thumbnail이 string이 아닐 때', async () => {
      createLessonDto.thumbnail = faker.datatype.number();
      const errors = await customValidate(createLessonDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });
});
