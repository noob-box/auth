import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'cors-regex', async: false })
export class CorsRegexValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    try {
      new RegExp(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return '$property ($value) is not a valid cors definition.';
  }
}
