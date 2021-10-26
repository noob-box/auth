import { IsEmail } from 'class-validator';

class GetUserQuery {
  @IsEmail()
  email: string;
}

export { GetUserQuery };
