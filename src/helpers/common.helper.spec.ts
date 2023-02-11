import { Test, TestingModule } from '@nestjs/testing';
import { CommonHelper } from '@src/helpers/common.helper';

describe('CommonHelper', () => {
  let commonHelper: CommonHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonHelper],
    }).compile();

    commonHelper = module.get<CommonHelper>(CommonHelper);
  });

  describe('setSeparator', () => {
    let separator: string;
    let regExp: RegExp;

    beforeEach(() => {
      separator = '-';
      regExp = new RegExp(separator);
    });

    it('하나만 들어왔을 경우', () => {
      const v1 = 'v1';

      expect(commonHelper.setSeparator(separator, v1)).not.toMatch(regExp);
    });

    it('두개가 들어왔을 경우', () => {
      const v1 = 'v1';
      const v2 = 'v2';

      expect(commonHelper.setSeparator(separator, v1, v2)).toMatch(regExp);
    });

    it('세개가 들어왔을 경우', () => {
      const v1 = 'v1';
      const v2 = 'v2';
      const v3 = 'v3';

      expect(commonHelper.setSeparator(separator, v1, v2, v3)).toMatch(regExp);
    });
  });
});
