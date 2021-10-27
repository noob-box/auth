import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

class UserResponse {
  id: string;
  email: string;
  name: string;

  @ApiProperty({ enum: Role })
  role: Role;
}

export { UserResponse };
