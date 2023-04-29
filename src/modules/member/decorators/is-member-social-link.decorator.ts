import { BadRequestException, Injectable } from '@nestjs/common';
import { ThePoolCacheService } from '@src/modules/core/the-pool-cache/services/the-pool-cache.service';
import { MemberSocialLinkDto } from '@src/modules/member/dtos/member-social-link.dto';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsMemberSocialLinkConstraint
  implements ValidatorConstraintInterface
{
  private readonly PROTOCOL = 'https://';

  constructor(private readonly thePoolCacheService: ThePoolCacheService) {}

  async validate(
    _value: MemberSocialLinkDto,
    args: ValidationArguments,
  ): Promise<boolean> {
    const { type, url } = args.object as MemberSocialLinkDto;
    const memberSocialLinks =
      await this.thePoolCacheService.getMemberSocialLinks();
    const targetSocial = memberSocialLinks.find((memberSocialLink) => {
      return memberSocialLink.id === type;
    });

    if (!targetSocial) {
      throw new BadRequestException(
        'memberSocialLinks 존재하지 않는 type 입니다.',
      );
    }

    if (/\s/.test(url)) {
      throw new BadRequestException(
        'memberSocialLinks url 은 공백이 존재할 수 없습니다.',
      );
    }

    const targetSocialDomain = targetSocial.socialDomain.replace(
      this.PROTOCOL,
      '',
    );

    const regExp = new RegExp(
      `https:\/\/(www.)?${targetSocialDomain}\/\\S{1,}`,
    );

    if (!regExp.test(url)) {
      throw new BadRequestException(
        'memberSocialLinks 유효하지 않은 url 입니다.',
      );
    }

    return true;
  }
}

export function IsMemberSocialLink(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsMemberSocialLinkConstraint,
    });
  };
}
