import { Role } from '@src/modules/user/constansts/enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseType {
  @ApiProperty({
    example: 1,
    description: 'user 고유 id',
    required: true,
    type: 'string',
  })
  id: number;

  @ApiProperty({
    example: 'example@example.com',
    description: 'user eamil',
    required: true,
    type: 'string',
  })
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: 'user 이름',
    required: true,
    type: 'string',
  })
  name: string;

  @ApiProperty({
    example: Role.Admin,
    description: 'user 권한',
    required: true,
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: 'user 생성일자',
    required: true,
    type: 'string',
  })
  createAt: string;
}
