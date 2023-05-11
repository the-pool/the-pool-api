import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaModel, Target } from '@src/types/type';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsRecordManyConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(value: any[], args: ValidationArguments): Promise<boolean> {
    const { model, field }: Target = args.constraints[0];
    const isShouldBeExist = args.constraints[1];
    const targetName = field || args.property;
    const modelName = model || args.object['model'];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const manyRecord: PrismaModel[] = await this.prismaService[
      modelName
    ].findMany({
      where: {
        [targetName]: { in: value },
      },
    });

    // 모두 존재하지 않아야 하는 경우
    if (!isShouldBeExist && manyRecord.length === 0) {
      return true;
    }
    // 모두가 존재해야하는 경우
    if (isShouldBeExist && manyRecord.length === value.length) {
      return true;
    }
    // 에러메시지에 필요한 field를 object의 existValue 저장
    args.object['existValue'] = manyRecord.map((record) => record[targetName]);

    return false;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const { value, property, constraints, object } = validationArguments;
    const { model, field } = constraints[0];
    const modelName = model || object['model'];
    const existValue = object['existValue'];
    const isShouldBeExist = constraints[1];
    const middleMessage = isShouldBeExist
      ? "doesn't exist"
      : 'is already exist';
    // 모두가 존재해야 하는 경우 > problemValue = value - existValue
    // 모두가 존재하지 않아야 하는 경우 > problemValue = existValue
    const problemValue = isShouldBeExist
      ? value.filter((value) => !existValue.includes(value))
      : existValue;

    return `${problemValue} ${middleMessage} ${
      field || property
    } in ${modelName}`;
  }
}

export function IsRecordMany<M extends PrismaModel = PrismaModel>(
  target: Target<M>,
  isShouldBeExist: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [target, isShouldBeExist],
      validator: IsRecordManyConstraint,
    });
  };
}
