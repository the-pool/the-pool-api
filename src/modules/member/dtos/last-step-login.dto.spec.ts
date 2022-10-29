import { customValidate, getValueByEnum } from '@src/common/common';
import { MajorId, MajorSkillId } from '@src/constants/enum';
import { MockLastStepLoginDto } from '@src/modules/test/mock-dto';
import { LastStepLoginDto } from './last-step-login.dto';

describe('LastStepLoginDto', () => {
  let lastStepLoginDto;

  beforeEach(async () => {
    lastStepLoginDto = new LastStepLoginDto();
  });

  it('should be defined', () => {
    expect(lastStepLoginDto).toBeDefined();
  });

  describe('nickname test', () => {
    it('success - nickname', async () => {
      lastStepLoginDto.nickname = '12345678910';

      expect(typeof lastStepLoginDto.nickname === 'string').toBeTruthy();
    });

    it('false - nickname이 string이 아닐 때', async () => {
      lastStepLoginDto = new MockLastStepLoginDto();
      lastStepLoginDto.nickname = 123456789;
      const errors = await customValidate(lastStepLoginDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });

    describe('majorId test', () => {
      it.each(getValueByEnum(MajorId, 'number'))(
        'success - MajorId: %s',
        async (majorId) => {
          lastStepLoginDto.majorId = majorId;

          const errors = await customValidate(lastStepLoginDto);

          expect(errors).toHaveLength(0);
        },
      );

      it('false - majorId에 숫자가 들어오지 않았을 때', async () => {
        lastStepLoginDto.majorId = '0';
        const errors = await customValidate(lastStepLoginDto);

        expect(errors[0].constraints).toHaveProperty('isNumber');
      });

      it('false - majorId에 아무런 값도 들어오지 않았을 때', async () => {
        lastStepLoginDto.majorId = null;
        const errors = await customValidate(lastStepLoginDto);

        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('false - majorId에 ENUM 이 아닌 값이 들어왔을 때', async () => {
        lastStepLoginDto.majorId = 3;
        const errors = await customValidate(lastStepLoginDto);

        expect(errors[0].constraints).toHaveProperty('isEnum');
      });
    });

    describe('memberSkill test', () => {
      it.each(getValueByEnum(MajorSkillId, 'number'))(
        'success - majorSkillId: %s',
        async (majorSkillId) => {
          lastStepLoginDto.memberSkill = [majorSkillId];
          const errors = await customValidate(lastStepLoginDto);

          expect(errors).toHaveLength(0);
        },
      );

      it('false - memberSkill에 아무런 값도 들어오지 않았을 때', async () => {
        lastStepLoginDto.memberSkill = [];
        const errors = await customValidate(lastStepLoginDto);

        expect(errors[0].constraints).toHaveProperty('arrayNotEmpty');
      });

      it('false - memberSkill에 ENUM 이 아닌 값이 들어왔을 때', async () => {
        lastStepLoginDto.memberSkill = 100;
        const errors = await customValidate(lastStepLoginDto);

        expect(errors[0].constraints).toHaveProperty('isEnum');
      });

      it('false - 한번에 11개 이상의 skill을 등록할 때', async () => {
        lastStepLoginDto.memberSkill = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const errors = await customValidate(lastStepLoginDto);

        expect(errors[0].constraints).toHaveProperty('arrayMaxSize');
      });
    });
  });
});
