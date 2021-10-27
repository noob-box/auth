import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SecurePassword } from '../utils/secure-password';
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

  private async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<SafeUser> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      select: this.safeUserSelect,
    });
  }
}
