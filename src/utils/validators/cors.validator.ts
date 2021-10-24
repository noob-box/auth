import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'cors', async: false })
export class CorsValidator implements ValidatorConstraintInterface {
  // Matches domains (e.g. developer.mozilla.org)
  private readonly domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

  validate(value: string): boolean {
    const trimmedValue = value?.trim();

    if (trimmedValue === '*') return true;

    if (!trimmedValue || trimmedValue.endsWith(',')) return false;

    trimmedValue.split(',').forEach((x) => {
      if (!this.domainRegex.test(x)) return false;
    });

    return true;
  }

  defaultMessage(): string {
    return 'CORS ($value) is not a valid cors definition.';
  }
}
