import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Role, Token, TokenType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hash256, SecurePassword } from '../utils/auth-utils';
import { SafeUser } from './models/safe-user';

@Injectable()
export class UsersService {
  private readonly safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    email: string,
    password: string,
    name: string,
    role: Role = Role.USER,
  ): Promise<SafeUser> {
    const hashedPassword = await SecurePassword.hash(password.trim());
    const user = await this.prismaService.user.create({
      data: { email: email.toLowerCase().trim(), hashedPassword, name, role },
      select: this.safeUserSelect,
    });

    return user;
  }

  async findAll(): Promise<SafeUser[]> {
    return this.prismaService.user.findMany({
      select: this.safeUserSelect,
    });
  }

  async findOneById(id: string): Promise<SafeUser> {
    return this.findOne({ id });
  }

  async findOneByEmail(email: string): Promise<SafeUser> {
    return this.findOne({ email });
  }

  async findOneByEmailAndValidate(rawEmail: string, rawPassword: string): Promise<SafeUser | null> {
    const email = rawEmail.toLowerCase().trim();
    const password = rawPassword.trim();

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException();

    const result = await SecurePassword.verify(user.hashedPassword, password);

    if (result === SecurePassword.VALID_NEEDS_REHASH) {
      // Upgrade hashed password with a more secure hash
      const improvedHash = await SecurePassword.hash(password);
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { hashedPassword: improvedHash },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...safeUser } = user;
    return safeUser;
  }

  async addUserRefreshToken(id: string, refreshToken: string, expiresAt: Date): Promise<Token> {
    const hashedToken = hash256(refreshToken);

    return this.prismaService.token.create({
      data: {
        user: { connect: { id } },
        type: TokenType.REFRESH,
        expiresAt,
        hashedToken,
      },
    });
  }

  async validateRefreshToken(id: string, hashedToken: string): Promise<boolean> {
    const possibleToken = await this.prismaService.token.findFirst({
      where: {
        hashedToken,
        userId: id,
      },
    });

    // 2. If token not found, error
    if (!possibleToken) {
      throw new UnauthorizedException();
    }
    const savedToken = possibleToken;

    // 3. Delete token so it can't be used again
    await this.prismaService.token.delete({ where: { id: savedToken.id } });

    if (savedToken.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    return true;
  }

  async updateUserRole(id: string, data: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update({
      where: { id },
      data,
      select: this.safeUserSelect,
    });
  }

  private async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<SafeUser> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      select: this.safeUserSelect,
    });
  }
}
