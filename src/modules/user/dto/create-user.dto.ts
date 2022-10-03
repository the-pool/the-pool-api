import { Role } from '@src/modules/user/constansts/enum';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}
