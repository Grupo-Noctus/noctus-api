import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsEmailOrUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailOrUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const usernameRegex = /^[a-zA-Z0-9._]{3,}$/;

          return emailRegex.test(value) || usernameRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `The ${args.property} must be a valid email or username (minimum 3 characters, only letters, numbers, underscores or dots).`;
        },
      },
    });
  };
}
