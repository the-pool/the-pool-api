import { OAuthAgency } from '@src/modules/core/auth/constants/oauth.enums';
import { LoginByOAuthDto } from './create-member-by-oauth.dto';
import {} from '@nestjs/swagger';
import { customValidate, getValueByEnum } from '@src/common/common';

describe('LoginByOAuthDto', () => {
  let createMemberByOAuthDto: { [key in keyof LoginByOAuthDto]: any };

  beforeEach(async () => {
    createMemberByOAuthDto = new LoginByOAuthDto();
  });

  it('should be defined', () => {
    expect(createMemberByOAuthDto).toBeDefined();
  });

  describe('accessToken test', () => {
    it('success - accessToken', async () => {
      createMemberByOAuthDto.accessToken = '12345678910';

      expect(
        typeof createMemberByOAuthDto.accessToken === 'string',
      ).toBeTruthy();
    });

    it('false - accessToken이 string이 아닐 때', async () => {
      createMemberByOAuthDto.accessToken = 123456789;
      const errors = await customValidate(createMemberByOAuthDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('false - accessToken에 아무런 값도 들어오지 않았을 때', async () => {
      createMemberByOAuthDto.accessToken = null;
      const errors = await customValidate(createMemberByOAuthDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('oAuthAgency test', () => {
    it.each(getValueByEnum(OAuthAgency, 'number'))(
      'success - oAuthAgency: %s',
      async (oAuthAgency) => {
        createMemberByOAuthDto.oAuthAgency = oAuthAgency;

        const errors = await customValidate(createMemberByOAuthDto);

        expect(errors).toHaveLength(0);
      },
    );

    it('false - oAuthAgency에 숫자가 들어오지 않았을 때', async () => {
      createMemberByOAuthDto.oAuthAgency = '0';
      const errors = await customValidate(createMemberByOAuthDto);

      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('false - oAuthAgency에 아무런 값도 들어오지 않았을 때', async () => {
      createMemberByOAuthDto.oAuthAgency = null;
      const errors = await customValidate(createMemberByOAuthDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('false - oAuthAgency이 ENUM 이 아닌 값이 들어왔을 때', async () => {
      createMemberByOAuthDto.oAuthAgency = 3;
      const errors = await customValidate(createMemberByOAuthDto);

      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });
});
