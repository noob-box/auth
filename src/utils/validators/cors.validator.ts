import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'cors', async: false })
export class CorsValidator implements ValidatorConstraintInterface {
  // Matches domains (e.g. developer.mozilla.org)
  private readonly domainRegex =
    /^(?:[\da-z](?:[\da-z-]{0,61}[\da-z])?\.)+[\da-z][\da-z-]{0,61}[\da-z]$/;

  validate(value: string): boolean {
    const trimmedValue = value?.trim();

    if (trimmedValue === '*') return true;

    if (!trimmedValue || trimmedValue.endsWith(',')) return false;

    for (const x of trimmedValue.split(',')) {
      if (!this.domainRegex.test(x)) return false;
    }

    return true;
  }

  defaultMessage(): string {
    return 'CORS ($value) is not a valid cors definition.';
  }
}
