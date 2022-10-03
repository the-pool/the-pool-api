import { Role } from '@src/modules/user/constansts/enum';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { IsAlreadyExist } from '@src/decorators/is-already-exist.decorator';

export class CreateUserDto {
  @IsString()
  password: string;

  @IsEmail()
  @IsAlreadyExist({ model: 'user' })
  email: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}
