import { Injectable, OnModuleInit } from '@nestjs/common';
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
  implements ValidatorConstraintInterface, OnModuleInit
{
  private readonly PROTOCOL = 'https://';

  constructor(private readonly thePoolCacheService: ThePoolCacheService) {}

  async onModuleInit(): Promise<void> {
    await this.thePoolCacheService.setMemberSocialLinks();
  }

  async validate(
    value: MemberSocialLinkDto,
    args: ValidationArguments,
  ): Promise<boolean> {
    const { type, url } = value;
    const memberSocialLinks =
      await this.thePoolCacheService.getMemberSocialLinks();
    const targetSocial = memberSocialLinks.find((memberSocialLink) => {
      return memberSocialLink.id === type;
    });

    if (!targetSocial) {
      return false;
    }

    if (!targetSocial.socialDomain.startsWith(this.PROTOCOL)) {
      return false;
    }

    const targetSocialDomain = targetSocial.socialDomain.replace(
      this.PROTOCOL,
      '',
    );

    // const regExp = new RegExp()

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const { value, property, constraints, object } = validationArguments;
    const { model, field } = constraints[0];
    const modelName = model || object['model'];
    const isShouldBeExist = constraints[1];
    const middleMessage = isShouldBeExist
      ? "doesn't exist"
      : 'is already exist';

    return `${value} ${middleMessage} ${field || property} in ${modelName}`;
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
