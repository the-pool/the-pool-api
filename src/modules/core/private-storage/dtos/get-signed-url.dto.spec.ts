import { faker } from '@faker-js/faker';
import { customValidate } from '@src/common/common';
import { GetSignedUrlDto } from './get-signed-url.dto';

describe('GetSignedUrlDto', () => {
  let getSignedUrlDto: { [key in keyof GetSignedUrlDto]: any };

  beforeEach(async () => {
    getSignedUrlDto = new GetSignedUrlDto();
  });

  it('should be defined', () => {
    expect(getSignedUrlDto).toBeDefined();
  });

  describe('folderName', () => {
    it('success - folderName', async () => {
      getSignedUrlDto.folderName = faker.lorem.word();
      expect(typeof getSignedUrlDto.folderName === 'string').toBeTruthy();
    });

    it('false - folderName이 string이 아닐 때', async () => {
      getSignedUrlDto.folderName = faker.datatype.number();
      const errors = await customValidate(getSignedUrlDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('false - folderName에 아무런 값도 들어오지 않았을 때', async () => {
      getSignedUrlDto.folderName = null;
      const errors = await customValidate(getSignedUrlDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('fileName', () => {
    it('success - fileName', async () => {
      getSignedUrlDto.fileName = faker.lorem.word();
      expect(typeof getSignedUrlDto.fileName === 'string').toBeTruthy();
    });

    it('false - fileName이 string이 아닐 때', async () => {
      getSignedUrlDto.fileName = faker.datatype.number();
      const errors = await customValidate(getSignedUrlDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('false - fileName에 아무런 값도 들어오지 않았을 때', async () => {
      getSignedUrlDto.fileName = null;
      const errors = await customValidate(getSignedUrlDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('fileType', () => {
    it('success - fileType', async () => {
      getSignedUrlDto.fileType = faker.system.commonFileExt();
      expect(typeof getSignedUrlDto.fileType === 'string').toBeTruthy();
    });

    it('false - fileType이 string이 아닐 때', async () => {
      getSignedUrlDto.fileType = faker.datatype.number();
      const errors = await customValidate(getSignedUrlDto);

      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('false - fileType에 아무런 값도 들어오지 않았을 때', async () => {
      getSignedUrlDto.fileType = null;
      const errors = await customValidate(getSignedUrlDto);

      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });
});
