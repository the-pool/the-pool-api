import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEssential<T>(
  essentialFields: (keyof T)[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [essentialFields],
      validator: {
        validate(value: string, args: any) {
          const essentialFields: string[] = args.constraints[0];
          const isExistEssentialFields = essentialFields.every(
            (essentialField) => {
              return args.object[essentialField];
            },
          );

          return isExistEssentialFields;
        },

        defaultMessage(validationArguments: ValidationArguments): string {
          return (
            validationArguments.property +
            ' is essential to ' +
            validationArguments.constraints[0]
          );
        },
      },
    });
  };
}
