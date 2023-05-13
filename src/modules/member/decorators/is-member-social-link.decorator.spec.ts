import { Test, TestingModule } from '@nestjs/testing';
import { ThePoolCacheService } from '@src/modules/core/the-pool-cache/services/the-pool-cache.service';
import { MemberSocialLinkEntity } from '@src/modules/member-social-link/entities/member-social-link.entity';
import { IsMemberSocialLinkConstraint } from '@src/modules/member/decorators/is-member-social-link.decorator';
import { MemberSocialLinkDto } from '@src/modules/member/dtos/member-social-link.dto';
import { mockThePoolCacheService } from '@test/mock/mock-services';
import { ValidationArguments } from 'class-validator';

describe('IsMemberSocialLinkConstraint', () => {
  let constraint: IsMemberSocialLinkConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsMemberSocialLinkConstraint,
        {
          provide: ThePoolCacheService,
          useValue: mockThePoolCacheService,
        },
      ],
    }).compile();

    constraint = module.get<IsMemberSocialLinkConstraint>(
      IsMemberSocialLinkConstraint,
    );
  });

  describe('validate', () => {
    let _value: MemberSocialLinkDto;
    let args: ValidationArguments;
    let memberSocialLinks: MemberSocialLinkEntity[];

    beforeEach(() => {
      const memberSocialLink = new MemberSocialLinkEntity();
      memberSocialLink.id = 1;
      memberSocialLink.socialDomain = 'https://github.com';

      _value = new MemberSocialLinkDto();
      args = {
        value: '',
        constraints: [''],
        targetName: '',
        property: '',
        object: {
          type: undefined,
          url: undefined,
        },
      };

      memberSocialLinks = [memberSocialLink];
      mockThePoolCacheService.getMemberSocialLinks.mockResolvedValue(
        memberSocialLinks,
      );
    });

    it('존재하지 않는 type', async () => {
      args.object = {
        type: 100000000,
        url: 'url',
      };

      await expect(constraint.validate(_value, args)).rejects.toThrowError(
        'memberSocialLinks 존재하지 않는 type 입니다.',
      );
    });

    it('url 공백 존재', async () => {
      args.object = {
        type: 1,
        url: 'u r l',
      };

      await expect(constraint.validate(_value, args)).rejects.toThrowError(
        'memberSocialLinks url 은 공백이 존재할 수 없습니다.',
      );
    });

    it('base domain 이 들어온 경우', async () => {
      args.object = {
        type: 1,
        url: 'https://github.com',
      };

      await expect(constraint.validate(_value, args)).rejects.toThrowError(
        'memberSocialLinks 유효하지 않은 url 입니다.',
      );
    });

    it('프로토콜이 없는 경우', async () => {
      args.object = {
        type: 1,
        url: 'github.com/seokho',
      };

      await expect(constraint.validate(_value, args)).rejects.toThrowError(
        'memberSocialLinks 유효하지 않은 url 입니다.',
      );
    });

    it('base domain 이 다른 경우', async () => {
      args.object = {
        type: 1,
        url: 'https://ithub.com/seokho',
      };

      await expect(constraint.validate(_value, args)).rejects.toThrowError(
        'memberSocialLinks 유효하지 않은 url 입니다.',
      );
    });

    it('유효한 url https://github.com/seokho', async () => {
      args.object = {
        type: 1,
        url: 'https://github.com/seokho',
      };

      await expect(constraint.validate(_value, args)).resolves.toBe(true);
    });

    it('유효한 url (www 포함)', async () => {
      args.object = {
        type: 1,
        url: 'https://www.github.com/seokho',
      };

      await expect(constraint.validate(_value, args)).resolves.toBe(true);
    });

    it('유효한 url / depth 2 이상', async () => {
      args.object = {
        type: 1,
        url: 'https://www.github.com/seokho/sub',
      };

      await expect(constraint.validate(_value, args)).resolves.toBe(true);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
