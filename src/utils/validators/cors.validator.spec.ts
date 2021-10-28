import { CorsValidator } from './cors.validator';

describe('CorsValidator', () => {
  describe('validate', () => {
    it('should return true given wildcard', () => {
      const validator = new CorsValidator();
      expect(validator.validate('*')).toBe(true);
    });

    it('should return true given single domain', () => {
      const validator = new CorsValidator();
      expect(validator.validate('google.com')).toBe(true);
    });

    it('should return true given single domain', () => {
      const validator = new CorsValidator();
      expect(validator.validate('developer.mozilla.org')).toBe(true);
    });

    it('should return true given list of domains', () => {
      const validator = new CorsValidator();
      expect(validator.validate('developer.mozilla.org,google.com,web.dev')).toBe(true);
      expect(validator.validate('developer.mozilla.org,google.com,web.dev')).toBe(true);
    });

    it('should return false given domain list with dangling comma', () => {
      const validator = new CorsValidator();
      expect(validator.validate('developer.mozilla.org,')).toBe(false);
    });

    it('should return false given empty string', () => {
      const validator = new CorsValidator();
      expect(validator.validate('')).toBe(false);
      expect(validator.validate(' ')).toBe(false);
    });
  });
});
