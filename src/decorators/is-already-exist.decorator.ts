import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { Target } from '@src/types/type';

@ValidatorConstraint({ async: true })
export class IsAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { model, field }: Target = args.constraints[0];
    const targetName = field || args.property;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const uniqueRecord = await this.prismaService[model].findUnique({
      where: {
        [targetName]: value,
      },
    });

    return !uniqueRecord;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { value, property, constraints } = validationArguments;
    const { model, field } = constraints[0];

    return `${value} is already exist ${field || property} in ${model}`;
  }
}

export function IsAlreadyExist(
  target: Target,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [target],
      validator: IsAlreadyExistConstraint,
    });
  };
}
