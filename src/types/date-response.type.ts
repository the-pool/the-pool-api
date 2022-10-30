import { ApiProperty } from '@nestjs/swagger';

export class DateResponseType {
  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
    required: true,
    type: 'string',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
    required: true,
    type: 'string',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '삭제일자',
    required: true,
    type: 'string',
  })
  deletedAt: Date | null;
}
