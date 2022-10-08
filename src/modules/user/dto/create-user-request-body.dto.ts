import { IsEmail, IsNumber, IsString } from 'class-validator';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestBodyDto {
  @ApiProperty({
    example: 'password',
    description: 'user password',
    required: true,
    type: 'string',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'user eamil',
    required: true,
    type: 'string',
  })
  @IsEmail()
  @IsRecord({ model: 'user' }, false)
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: 'user 이름',
    required: true,
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'user 권한',
    required: true,
    type: 'number',
  })
  @IsNumber()
  role: number;
}
