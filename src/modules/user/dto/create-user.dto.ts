import { Role } from '@src/modules/user/constansts/enum';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { IsRecord } from '@src/decorators/is-record.decorator';

export class CreateUserDto {
  @IsString()
  password: string;

  @IsEmail()
  @IsRecord({ model: 'user' }, false)
  email: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}
