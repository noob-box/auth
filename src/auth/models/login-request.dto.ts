import { IsNotEmpty } from 'class-validator';

class LoginRequest {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export { LoginRequest };
