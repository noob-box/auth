import { CorsRegexValidator } from './cors-regex.validator';

describe('CorsRegexValidator', () => {
  describe('validate', () => {
    it('should return true valid regex string', () => {
      const validator = new CorsRegexValidator();
      expect(validator.validate('(test|auth|api).example.com')).toBe(true);
    });

    it('should return false given invalid regex string', () => {
      const validator = new CorsRegexValidator();
      expect(validator.validate('\\')).toBe(false);
    });
  });
});
