import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { hostNameRegex } from '../regex';

@ValidatorConstraint({ name: 'cors', async: false })
export class CorsValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const trimmedValue = value?.trim();

    if (trimmedValue === '*') return true;
    if (trimmedValue === 'localhost') return true;

    if (!trimmedValue || trimmedValue.endsWith(',')) return false;

    for (const x of trimmedValue.split(',')) {
      if (!hostNameRegex.test(x)) return false;
    }

    return true;
  }

  defaultMessage(): string {
    return '$property ($value) is not a valid cors definition.';
  }
}
