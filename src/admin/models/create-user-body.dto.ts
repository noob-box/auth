import { Role } from '.prisma/client';
import { IsEmail, IsEnum, IsOptional, Matches, MinLength } from 'class-validator';

class CreateUserBody {
  @IsEmail()
  email: string;

  @MinLength(4)
  name: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@])[\d!$%&*?@A-Za-z]+$/, {
    message:
      '$property needs at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}

export { CreateUserBody };
