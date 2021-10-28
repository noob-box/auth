import * as crypto from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import SecurePasswordLib from 'secure-password';
import { nanoid } from 'nanoid';

const SP = () => new SecurePasswordLib();

const hash256 = (input = '') => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

const generateToken = (numberOfCharacters = 32) => nanoid(numberOfCharacters);

const SecurePassword = {
  ...SecurePasswordLib,

  async hash(password: string | null | undefined) {
    if (!password) {
      throw new UnauthorizedException();
    }
    const hashedBuffer = await SP().hash(Buffer.from(password));
    return hashedBuffer.toString('base64');
  },

  async verify(hashedPassword: string | null | undefined, password: string | null | undefined) {
    if (!hashedPassword || !password) {
      throw new UnauthorizedException();
    }
    try {
      const result = await SP().verify(
        Buffer.from(password),
        Buffer.from(hashedPassword, 'base64'),
      );
      // Return result for valid results.
      switch (result) {
        case SecurePassword.VALID:
        case SecurePassword.VALID_NEEDS_REHASH:
          return result;
        default:
          // For everything else throw AuthenticationError
          throw new UnauthorizedException();
      }
    } catch {
      // Could be error like failed to hash password
      throw new UnauthorizedException();
    }
  },
};

export { SecurePassword, generateToken, hash256 };
