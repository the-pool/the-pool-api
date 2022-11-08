import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmptyString(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: any) {
          if (typeof value === 'string') return value.trim().length > 0;
          return true;
        },
      },
    });
  };
}
