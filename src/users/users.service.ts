import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './models/user.dto';

@Injectable()
export class UsersService {
  private readonly safeUserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    hashedPassword: false,
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(email: string, password: string, name: string): Promise<UserDto> {
    return this.prismaService.user.create({
      data: {
        email,
        hashedPassword: password,
        name,
      },
    });
  }

  async findAll(): Promise<UserDto[]> {
    return this.prismaService.user.findMany({
      select: this.safeUserSelect,
    });
  }

  async findOneById(id: string): Promise<UserDto> {
    return this.findOne({ id });
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    return this.findOne({ email });
  }

  async findOneByEmailAndValidate(email: string, password: string): Promise<UserDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user && user.hashedPassword === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }

  private async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserDto> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      select: this.safeUserSelect,
    });
  }
}
